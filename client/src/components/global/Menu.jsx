import React from "react";
import { Link } from "react-router-dom";
import { logout } from "../../redux/actions/authAction";
import { useSelector, useDispatch } from "react-redux";

const Menu = () => {
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();
  const links = [
    { label: "HOME", path: "/" },
    { label: "ABOUT", path: "/" },
    { label: "WRITE", path: "/create_blog" },
    { label: "CONTACT", path: "/" },
    // { label: "REGISTER", path: "/register" },
    // { label: "LOGIN", path: "/login" },
  ];
  if (!auth.access_token) {
    links.push(
      { label: "REGISTER", path: "/register" },
      { label: "LOGIN", path: "/login" }
    );
  }

  const handleLogout = () => {
    if (!auth.access_token) return;
    dispatch(logout(auth.access_token));
  };

  return (
    <ul className="navbar-nav ms-auto">
      {links.map((link, index) => (
        <li key={index} className="nav-item" style={{ marginRight: "24px" }}>
          <Link
            className="nav-link"
            to={link.path}
            style={{ color: "#333", textDecoration: "none" }}
            onMouseOver={(e) => (e.target.style.color = "#1da1f2")}
            onMouseLeave={(e) => (e.target.style.color = "#333")}
          >
            {link.label}
          </Link>
        </li>
      ))}
      {auth.user?.role === "admin" && (
        <li className={`nav-item`} style={{ marginRight: "24px" }}>
          <Link
            to="/category"
            className="nav-link"
            style={{ color: "#333" }}
            onMouseOver={(e) => (e.target.style.color = "#1da1f2")}
            onMouseLeave={(e) => (e.target.style.color = "#333")}
          >
            CATEGORY
          </Link>
        </li>
      )}
      {auth.user && (
        <li className="nav-item dropdown">
          <div
            className="nav-link dropdown-toggle"
            id="navbarDropdown"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <img src={auth.user.avatar} alt="avatar" className="avatar" />
          </div>

          <ul
            className="dropdown-menu"
            aria-labelledby="navbarDropdown"
            style={{ minWidth: "6rem" }}
          >
            <li>
              <Link className="dropdown-item" to={`/profile/${auth.user._id}`}>
                Profile
              </Link>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <Link className="dropdown-item" to="/" onClick={handleLogout}>
                Logout
              </Link>
            </li>
          </ul>
        </li>
      )}
    </ul>
  );
};

export default Menu;
