import React from "react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import LoginForm from "../components/auth/LoginForm";
import SocialLogin from "../components/auth/SocialLogin";

const Login = () => {
  const navigate = useNavigate();
  const { auth } = useSelector((state) => state);
  const search = window.location.search;

  useEffect(() => {
    if (auth.access_token) {
      if (search) {
        let url = search.replace("?", "/");
        navigate(url);
      } else navigate("/");
    }
  }, [auth.access_token, navigate, search]);
  return (
    <div className="auth_page">
      <div className="auth_box">
        <h3 className="text-uppercase text-center mb-4">Login Form</h3>
        <SocialLogin />
        <LoginForm />

        <small className="row my-2 text-primary" style={{ cursor: "pointer" }}>
          <span className="col-6">
            <Link to="/forgot_password">Forgot password ?</Link>
          </span>

          {/* <span className="col-6 text-end" onClick={() => setSms(!sms)}>
            { sms ? 'Sign in with password' : 'Sign in with SMS' }
          </span> */}
        </small>

        <p>
          You don't have an account?
          <Link to={`/register${search}`} style={{ color: "crimson" }}>
            {` Register Now`}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
