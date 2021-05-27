import React, { useState } from "react";
import { useAuth } from "../contexts/AuthProvider";
import firebaseApp from "../firebase";
import uuid from "react-uuid";
import { Link } from "react-router-dom";
import { SuggestedProfiles } from "./SuggestedProfiles";

export const Sidebar = () => {
  const { userInfo, suggestions } = useAuth();

  const [newImage, setNewImage] = useState();
  const [newCaption, setNewCaption] = useState();

  const handleNewPost = (e) => {
    e.preventDefault();

    firebaseApp.firestore().collection("photos").add({
      userId: userInfo.userId,
      comments: [],
      likes: [],
      photoId: uuid(),
      imageSrc: newImage,
      caption: newCaption,
      dateCreated: Date.now(),
    });

    setNewCaption("");
    setNewImage("");
  };

  //here

  return (
    <div className="sidebar">
      <Link
        style={{ textDecoration: "none" }}
        to={`./profile/${userInfo?.username}`}
        className="user-profile"
      >
        <img
          className="user-img"
          src={`/images/avatars/${userInfo?.username}.jpg`}
          alt=""
          onError={(e) => {
            e.target.src = `/images/avatars/default.png`;
          }}
        />
        <div className="user-names">
          <p className="user-username">{userInfo?.username}</p>
          <p className="user-fullname">{userInfo?.fullName}</p>
        </div>
      </Link>

      <div className="newPost">
        <form className="new-post-form" onSubmit={handleNewPost}>
          <div className="new-post-form-inputs">
            <input
              className="new-post-image"
              type="text"
              placeholder="Add image url..."
              value={newImage}
              onChange={(e) => setNewImage(e.target.value)}
            />
            <hr />
            <input
              className="new-post-caption"
              type="text"
              placeholder="Add a caption..."
              value={newCaption}
              onChange={(e) => setNewCaption(e.target.value)}
            />
          </div>

          <button disabled={!newImage} className="new-post-btn" type="submit">
            Post image
          </button>
        </form>
      </div>

      <p>Suggestions for you</p>
      {suggestions?.map((profile) => (
        <SuggestedProfiles key={profile.docId} profile={profile} />
      ))}
    </div>
  );
};
