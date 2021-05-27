import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthProvider";
import { Link } from "react-router-dom";
import { Like } from "./Like";
import { Comment } from "./Comment";

export const Timeline = () => {
  const { photos } = useAuth();
  const [post, setPost] = useState([]);

  useEffect(() => {
    setPost(photos);
  }, [photos]);

  return (
    <div>
      <ul>
        {post?.map((item, index) => (
          <li key={index} className="post-user">
            <div className="post">
              <div>
                <Link
                  style={{ textDecoration: "none" }}
                  to={`./profile/${item.username}`}
                  className="post-user-info"
                >
                  <img
                    className="post-user-img"
                    src={`/images/avatars/${item.username}.jpg`}
                    alt=""
                    onError={(e) => {
                      e.target.src = `/images/avatars/default.png`;
                    }}
                  />
                  <h2 className="post-user-name">{item.username}</h2>
                </Link>
              </div>
              <div className="post-main-img">
                <img
                  className="post-image"
                  src={item.imageSrc}
                  alt="user post"
                />
              </div>
              <div className="post-interaction">
                <Like
                  id={item.docId}
                  like={item.liked}
                  likeCount={item.likes.length}
                />
              </div>
              <div className="post-caption">
                <p>
                  <span className="comment-username">{item.username}</span>
                  {item.caption}
                </p>
              </div>
              <div className="post-comments">
                <Comment id={item.docId} comments={item.comments} />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
