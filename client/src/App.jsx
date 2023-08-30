import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";

import PageRender from "./PageRender";
import Header from "./components/global/Header";
import Footer from "./components/global/Footer";
import Alert from "./components/alert/Alert";
import { refreshToken } from "./redux/actions/authAction";
import { getCategories } from "./redux/actions/categoryAction";
import { getHomeBlogs } from "./redux/actions/blogAction";
// import { getComments } from "./redux/actions/commentAction";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getHomeBlogs());
    dispatch(getCategories());
    dispatch(refreshToken());
  }, [dispatch]);

  return (
    <div>
      <Router>
        <Header />
        <Alert />
        <Routes>
          <Route exact path="/" element={<PageRender />} />
          <Route exact path="/:page" element={<PageRender />} />
          <Route exact path="/:page/:slug" element={<PageRender />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
};

export default App;
