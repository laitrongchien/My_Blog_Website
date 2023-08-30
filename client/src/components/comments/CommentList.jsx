import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Input from "./Input";
import {
  replyComment,
  updateComment,
  deleteComment,
} from "../../redux/actions/commentAction";

const CommentList = ({ comment, showReply, setShowReply, children }) => {
  const [onReply, setOnReply] = useState(false);
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [edit, setEdit] = useState();

  const handleReply = (body) => {
    if (!auth.user || !auth.access_token) return;

    const data = {
      user: auth.user,
      blog_id: comment.blog_id,
      blog_user_id: comment.blog_user_id,
      content: body,
      reply_user: comment.user,
      comment_root: comment.comment_root || comment._id,
      createdAt: new Date().toISOString(),
    };
    console.log(typeof showReply);
    setShowReply([...showReply, data]);
    dispatch(replyComment(data, auth.access_token));
    setOnReply(false);
  };

  const handleUpdate = (body) => {
    if (!auth.user || !auth.access_token || !edit) return;

    if (body === edit.content) return setEdit(undefined);

    const newComment = { ...edit, content: body };
    dispatch(updateComment(newComment, auth.access_token));
    setEdit(undefined);
  };

  const handleDelete = (comment) => {
    if (!auth.user || !auth.access_token) return;
    dispatch(deleteComment(comment, auth.access_token));
  };

  const Nav = (comment) => {
    return (
      <div>
        <i
          className="fa-solid fa-trash-can mx-2 delete-icon"
          onClick={() => handleDelete(comment)}
        />
        <i
          className="fa-solid fa-pen-to-square mx-2 edit-icon"
          onClick={() => setEdit(comment)}
        />
      </div>
    );
  };

  return (
    <div className="w-100">
      {edit ? (
        <Input callback={handleUpdate} edit={edit} setEdit={setEdit} />
      ) : (
        <div className="comment_box">
          <div
            className="px-3 py-2 comment_box-input"
            dangerouslySetInnerHTML={{
              __html: comment.content,
            }}
          />

          <div className="d-flex justify-content-between px-2">
            <div className="d-flex">
              <small style={{ cursor: "pointer", marginRight: "16px" }}>
                Like
              </small>
              <small
                style={{ cursor: "pointer", marginRight: "16px" }}
                onClick={() => setOnReply(!onReply)}
              >
                {onReply ? "Cancel" : "Reply"}
              </small>
              <small className="d-flex">
                <div style={{ cursor: "pointer" }}>
                  {comment.blog_user_id === auth.user?._id ? (
                    comment.user._id === auth.user._id ? (
                      Nav(comment)
                    ) : (
                      <i
                        className="fa-solid fa-trash-can mx-2 delete-icon"
                        onClick={() => handleDelete(comment)}
                      />
                    )
                  ) : (
                    comment.user._id === auth.user?._id && Nav(comment)
                  )}
                </div>
              </small>
            </div>

            <small>{new Date(comment.createdAt).toLocaleString()}</small>
          </div>
        </div>
      )}
      {onReply && <Input callback={handleReply} />}

      {children}
    </div>
  );
};

export default CommentList;
