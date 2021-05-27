import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";
import firebaseApp from "../firebase";
import firebase from "firebase";

export const Comment = ({ id, comments }) => {
  const { FieldValue } = firebase.firestore;
  const { userInfo } = useAuth();
  const [postComments, setPostComments] = useState(comments);
  const [newComment, setNewComment] = useState("");

  const handleComment = (event) => {
    event.preventDefault();

    const displayName = userInfo.username;

    setPostComments((postComments) => [
      ...postComments,
      { displayName, comment: newComment },
    ]);

    firebaseApp
      .firestore()
      .collection("photos")
      .doc(id)
      .update({
        comments: FieldValue.arrayUnion({ displayName, comment: newComment }),
      });

    setNewComment("");
  };

  return (
    <div>
      {postComments.map((item, index) => (
        <p key={index}>
          <Link to={`/p/${item.displayName}`}>
            <span className="comment-username">{item.displayName}</span>
          </Link>
          <span className="comment-msg">{item.comment}</span>
        </p>
      ))}

      <form className="comment-form" onSubmit={handleComment}>
        <input
          className="comment-text"
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
        />
        <button className="comment-btn" type="submit" disabled={!newComment}>
          Post
        </button>
      </form>
    </div>
  );
};
