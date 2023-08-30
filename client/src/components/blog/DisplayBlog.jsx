import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import Input from "../comments/Input";
import Comments from "../comments/Comments";
import Loading from "../global/Loading";
import { createComment, getComments } from "../../redux/actions/commentAction";

const DisplayBlog = ({ blog }) => {
  const { auth, comments } = useSelector((state) => state);
  const dispatch = useDispatch();

  const [showComments, setShowComments] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleComment = (body) => {
    if (!auth.user || !auth.access_token) return;

    const data = {
      content: body,
      user: auth.user,
      blog_id: blog._id,
      blog_user_id: blog.user._id,
      createdAt: new Date().toISOString(),
    };

    setShowComments([data, ...showComments]);
    dispatch(createComment(data, auth.access_token));
  };

  useEffect(() => {
    // if (comments.data.length === 0) return;
    setShowComments(comments.data);
  }, [comments.data]);

  const fetchComments = useCallback(
    async (id) => {
      setLoading(true);
      await dispatch(getComments(id));
      setLoading(false);
    },
    [dispatch]
  );

  useEffect(() => {
    fetchComments(blog._id);
  }, [blog._id, fetchComments]);

  return (
    <div style={{ padding: "0 200px" }}>
      <h3
        className="text-center my-3 text-capitalize fs-1"
        style={{ color: "#1da1f2" }}
      >
        {blog.title}
      </h3>

      <div className="text-end fst-italic" style={{ color: "teal" }}>
        <small>
          {typeof blog.user !== "string" && `By: ${blog.user.name}`}
        </small>

        <small className="ms-2">
          {new Date(blog.createdAt).toLocaleString()}
        </small>
      </div>

      <div
        dangerouslySetInnerHTML={{
          __html: blog.content,
        }}
      />
      <hr className="my-4" />
      <h3 style={{ color: "#ff7a00" }}>--- Comments ---</h3>

      {auth.user ? (
        <Input callback={handleComment} />
      ) : (
        <h5>
          Please <Link to={`/login?blog/${blog._id}`}>login</Link> to comment.
        </h5>
      )}

      {loading ? (
        <Loading />
      ) : (
        showComments?.map((comment, index) => (
          <Comments key={index} comment={comment} />
        ))
      )}
    </div>
  );
};

export default DisplayBlog;
