import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import Loading from "../../components/global/Loading";
import Pagination from "../../components/global/Pagination";
import CardVert from "../../components/cards/CartVert";

import { getBlogsByCategoryId } from "../../redux/actions/blogAction";

const BlogsByCategory = () => {
  const { categories, blogsCategory } = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { slug } = useParams();

  const [categoryId, setCategoryId] = useState("");
  const [blogs, setBlogs] = useState();
  const [total, setTotal] = useState(0);
  const search = window.location.search;

  useEffect(() => {
    const category = categories.find((item) => item.name === slug);
    if (category) setCategoryId(category._id);
  }, [slug, categories]);

  useEffect(() => {
    if (!categoryId) return;

    if (blogsCategory.every((item) => item.id !== categoryId)) {
      dispatch(getBlogsByCategoryId(categoryId, search));
    } else {
      const data = blogsCategory.find((item) => item.id === categoryId);
      if (!data) return;
      setBlogs(data.blogs);
      setTotal(data.total);

      if (data.search) navigate(data.search);
    }
  }, [categoryId, blogsCategory, dispatch, search, navigate]);

  const handlePagination = (num) => {
    const searchQuery = `?page=${num}`;
    dispatch(getBlogsByCategoryId(categoryId, searchQuery));
  };

  if (!blogs) return <Loading />;
  return (
    <div className="blogs_category">
      <div className="show_blogs">
        {blogs.map((blog) => (
          <CardVert key={blog._id} blog={blog} />
        ))}
      </div>
      <Pagination total={total} callback={handlePagination} />
    </div>
  );
};

export default BlogsByCategory;
