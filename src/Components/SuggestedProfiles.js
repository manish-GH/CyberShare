import React, { useState } from "react";
import firebaseApp from "../firebase";
import firebase from "firebase";
import { useAuth } from "../contexts/AuthProvider";
import { Link } from "react-router-dom";
import { updateUserProfile } from "../helpers/utils";

export const SuggestedProfiles = ({ profile }) => {
  const { FieldValue } = firebase.firestore;
  const { userInfo, currentUser, setUserInfo, setSuggestions, setPhotos } =
    useAuth();
  const [followed, setFollowed] = useState(false);

  async function handleFollow() {
    setFollowed(true);
    await firebaseApp
      .firestore()
      .collection("users")
      .doc(userInfo.docId)
      .update({ following: FieldValue.arrayUnion(profile.userId) });
    await firebaseApp
      .firestore()
      .collection("users")
      .doc(profile.docId)
      .update({ followers: FieldValue.arrayUnion(userInfo.userId) });

    updateUserProfile(
      userInfo,
      currentUser,
      setUserInfo,
      setSuggestions,
      setPhotos
    );
  }

  return !followed ? (
    <div className="suggest">
      <Link
        style={{ textDecoration: "none" }}
        to={`./profile/${profile.username}`}
        className="suggest-profile"
      >
        <img
          className="suggest-img"
          src={`/images/avatars/${profile.username}.jpg`}
          alt=""
          onError={(e) => {
            e.target.src = `/images/avatars/default.png`;
          }}
        />
        <p className="suggest-name">{profile.username}</p>
      </Link>
      <button className="suggest-follow-btn" onClick={handleFollow}>
        follow
      </button>
    </div>
  ) : null;
};
