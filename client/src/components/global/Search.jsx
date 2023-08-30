import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

import { getAPI } from "../../utils/FetchData";

import CardHoriz from "../cards/CardHoriz";

const Search = () => {
  const [search, setSearch] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  const { pathname } = useLocation();

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (search.length < 2) return setBlogs([]);

      try {
        const res = await getAPI(`search/blogs?title=${search}`);
        setBlogs(res.data);
      } catch (err) {
        console.log(err);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  useEffect(() => {
    setSearch("");
    setBlogs([]);
  }, [pathname]);

  const handleFocus = () => {
    setShowResults(true);
  };

  const handleBlur = () => {
    setShowResults(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="search w-100 position-relative me-4" ref={searchRef}>
      <input
        type="text"
        className="form-control me-2 w-100"
        value={search}
        placeholder="Enter your search..."
        onChange={(e) => setSearch(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />

      {search.length >= 2 && showResults && (
        <div
          className="position-absolute pt-2 px-1 w-100 rounded"
          style={{
            background: "#eee",
            zIndex: 10,
            maxHeight: "calc(100vh - 100px)",
            overflow: "auto",
          }}
        >
          {blogs.length ? (
            blogs.map((blog) => <CardHoriz key={blog._id} blog={blog} />)
          ) : (
            <h3 className="text-center">Not Found</h3>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
