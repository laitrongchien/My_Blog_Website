import React from "react";
import { Link } from "react-router-dom";

const AvatarReply = ({ user, reply_user }) => {
  return (
    <div className="avatar_reply">
      <img src={user.avatar} alt="avatar" />

      <div className="ms-1">
        <small>
          <Link to={`/profile/${user._id}`} style={{ textDecoration: "none" }}>
            {user.name}
          </Link>
        </small>

        <small className="reply-text">
          Reply to{" "}
          <Link
            to={`/profile/${reply_user?._id}`}
            style={{ textDecoration: "none" }}
          >
            {reply_user?.name}
          </Link>
        </small>
      </div>
    </div>
  );
};

export default AvatarReply;
