import React, { useState } from "react";
import firebaseApp from "../firebase";
import firebase from "firebase";
import { useAuth } from "../contexts/AuthProvider";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";

export const Like = ({ id, like, likeCount }) => {
  const { FieldValue } = firebase.firestore;
  const { userInfo } = useAuth();
  const [liked, setLiked] = useState(like);
  const [count, setCount] = useState(likeCount);

  const likeHandler = async (id) => {
    setLiked(!liked);
    if (liked) {
      setCount((count) => count - 1);
      await firebaseApp
        .firestore()
        .collection("photos")
        .doc(id)
        .update({
          likes: FieldValue.arrayRemove(userInfo.userId),
        });
    } else {
      setCount((count) => count + 1);
      await firebaseApp
        .firestore()
        .collection("photos")
        .doc(id)
        .update({
          likes: FieldValue.arrayUnion(userInfo.userId),
        });
    }
  };
  return (
    <div className="like-btn-container">
      <button className="like-btn" onClick={() => likeHandler(id)}>
        {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      </button>
      <p className="like-count">{count}</p>
    </div>
  );
};
