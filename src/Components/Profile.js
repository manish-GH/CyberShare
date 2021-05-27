import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import firebaseApp from "../firebase";
import firebase from "firebase";
import { Header } from "./Header";
import { useAuth } from "../contexts/AuthProvider";
import { updateUserProfile } from "../helpers/utils";

export const Profile = () => {
  const { FieldValue } = firebase.firestore;
  const { username } = useParams();
  const { userInfo, currentUser, setUserInfo, setSuggestions, setPhotos } =
    useAuth();
  const [userProfile, setUserProfile] = useState();
  const [following, setFollowing] = useState(true);
  const [posts, setPosts] = useState();

  async function handleFollow() {
    setFollowing(true);
    await firebaseApp
      .firestore()
      .collection("users")
      .doc(userInfo.docId)
      .update({ following: FieldValue.arrayUnion(userProfile.userId) });
    await firebaseApp
      .firestore()
      .collection("users")
      .doc(userProfile.docId)
      .update({ followers: FieldValue.arrayUnion(userInfo.userId) });

    updateUserProfile(
      userInfo,
      currentUser,
      setUserInfo,
      setSuggestions,
      setPhotos
    );
  }

  async function handleUnfollow() {
    setFollowing(false);
    await firebaseApp
      .firestore()
      .collection("users")
      .doc(userInfo.docId)
      .update({ following: FieldValue.arrayRemove(userProfile.userId) });
    await firebaseApp
      .firestore()
      .collection("users")
      .doc(userProfile.docId)
      .update({ followers: FieldValue.arrayRemove(userInfo.userId) });

    updateUserProfile(
      userInfo,
      currentUser,
      setUserInfo,
      setSuggestions,
      setPhotos
    );
  }

  useEffect(() => {
    async function getProfile() {
      const result = await firebaseApp
        .firestore()
        .collection("users")
        .where("username", "==", username)
        .get();
      const user = result.docs.map((item) => ({
        ...item.data(),
        docId: item.id,
      }));
      setUserProfile(user[0]);
    }

    getProfile();
  }, [username]);

  useEffect(() => {
    const isFollowing = userProfile?.followers.includes(userInfo.userId);
    setFollowing(isFollowing);

    async function getPosts() {
      const result = await firebaseApp
        .firestore()
        .collection("photos")
        .where("userId", "==", userProfile?.userId)
        .get();
      const photos = result.docs.map((item) => ({
        ...item.data(),
        docId: item.id,
      }));
      setPosts(photos);
    }
    if (userProfile?.userId) {
      getPosts();
    }
    // eslint-disable-next-line
  }, [userProfile]);

  return (
    <div className="home">
      <div className="sticky">
        <Header />
      </div>
      <div>
        <div className="profile-data">
          <img
            className="profile-img"
            src={`/images/avatars/${userProfile?.username}.jpg`}
            alt=""
            onError={(e) => {
              e.target.src = `/images/avatars/default.png`;
            }}
          />
          <div className="profile-info">
            <div className="profile-info-1">
              <h2>{userProfile?.username}</h2>
              {userInfo?.username !== userProfile?.username ? (
                following ? (
                  <button
                    onClick={handleUnfollow}
                    className="profile-unfollow-btn"
                  >
                    Unfollow
                  </button>
                ) : (
                  <button onClick={handleFollow} className="profile-follow-btn">
                    Follow
                  </button>
                )
              ) : null}
            </div>
            <div className="profile-info-2">
              <p>
                <span>{posts?.length}</span> photos
              </p>
              <p>
                <span>{userProfile?.followers.length}</span> followers
              </p>
              <p>
                <span>{userProfile?.following.length}</span> following
              </p>
            </div>
            <div className="profile-info-3">
              <p>{userProfile?.fullName}</p>
            </div>
          </div>
        </div>
        <hr />
        <div>
          <ul className="profile-posts">
            {posts?.map((post, index) => (
              <li key={index}>
                <img
                  className="profile-post"
                  src={post.imageSrc}
                  alt={post.username}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
