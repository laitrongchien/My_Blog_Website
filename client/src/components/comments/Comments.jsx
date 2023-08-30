import React, { useState, useEffect } from "react";
import AvatarComment from "./AvatarComment";
import AvatarReply from "./AvatarReply";
import CommentList from "./CommentList";

const Comments = ({ comment }) => {
    const [showReply, setShowReply] = useState([]);
    useEffect(() => {
        if(!comment.replyCM) return;
        setShowReply(comment.replyCM)
      },[comment.replyCM])
      
  return (
    <div
      className="my-3 d-flex"
      style={{
        opacity: comment._id ? 1 : 0.5,
        pointerEvents: comment._id ? "initial" : "none",
      }}
    >
      <AvatarComment user={comment.user} />

      <CommentList 
      comment={comment} 
      showReply={showReply}
      setShowReply={setShowReply}
      >
        {
          showReply.map((comment, index) => (
            <div key={index} style={{
              opacity: comment._id ? 1 : 0.5,
              pointerEvents: comment._id ? 'initial' : 'none'
            }}>
              <AvatarReply
                user={comment.user}
                reply_user={comment.reply_user}
              />

              <CommentList 
                comment={comment} 
                showReply={showReply}
                setShowReply={setShowReply}
              />
            </div>
          ))
        }

      </CommentList>
    </div>
  );
};

export default Comments;
