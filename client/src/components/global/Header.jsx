import React from "react";
import { Link } from "react-router-dom";
import Menu from "./Menu";
import Search from "./Search";

const Header = () => {
  return (
    <nav
      className="navbar navbar-expand-lg navbar-light bg-light px-5 py-2 position-sticky fixed-top"
      style={{ borderBottom: "1px solid #ccc" }}
    >
      <Link className="navbar-brand" to="/">
        Blog-App
      </Link>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <Search />
        <Menu />
      </div>
    </nav>
  );
};

export default Header;
