import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import CardHoriz from "../cards/CardHoriz";
import Loading from "../global/Loading";
import Pagination from "../global/Pagination";

import { getBlogsByUserId } from "../../redux/actions/blogAction";

const UserBlogs = () => {
  const { blogsUser } = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user_id = useParams().slug;

  const [blogs, setBlogs] = useState();
  const [total, setTotal] = useState(0);

  const search = window.location.search;

  useEffect(() => {
    if (!user_id) return;

    if (blogsUser.every((item) => item.id !== user_id)) {
      dispatch(getBlogsByUserId(user_id, search));
    } else {
      const data = blogsUser.find((item) => item.id === user_id);
      if (!data) return;

      setBlogs(data.blogs);
      setTotal(data.total);
      if (data.search) navigate(data.search);
    }
  }, [user_id, blogsUser, dispatch, search, navigate]);

  const handlePagination = (num) => {
    const searchQuery = `?page=${num}`;
    dispatch(getBlogsByUserId(user_id, searchQuery));
  };

  if (!blogs) return <Loading />;

  if (blogs.length === 0 && total < 1)
    return <h3 className="text-center">No Blogs</h3>;

  return (
    <div>
      <div>
        {blogs.map((blog) => (
          <CardHoriz key={blog._id} blog={blog} />
        ))}
      </div>

      <div>
        <Pagination total={total} callback={handlePagination} />
      </div>
    </div>
  );
};

export default UserBlogs;
