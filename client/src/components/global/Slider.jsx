import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Slider = () => {
  const { auth } = useSelector((state) => state);
  const createPostLink = auth.user ? "/create_blog" : "/login";
  return (
    <div className="slider">
      <div className="background_overlay"></div>
      <div className="slider_content">
        <h1>Welcome To My Blog</h1>
        <h2>Create Your Post</h2>
        <span className="slider_icon-wrapper">
          <i className="fa-brands fa-facebook-f slider_icon"></i>
          <i className="fa-brands fa-twitter slider_icon"></i>
          <i className="fa-brands fa-instagram slider_icon"></i>
          <i className="fa-brands fa-youtube slider_icon"></i>
        </span>
        <Link className="create_btn" to={createPostLink}>
          <span>Create Post</span>
        </Link>
      </div>
    </div>
  );
};

export default Slider;
