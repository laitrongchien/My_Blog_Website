import { postAPI, getAPI } from "../../utils/FetchData";
import { validRegister } from "../../utils/Valid";
import { checkTokenExp } from "../../utils/checkTokenExp";

export const login = (userLogin) => async (dispatch) => {
  try {
    dispatch({ type: "ALERT", payload: { loading: true } });
    const res = await postAPI("login", userLogin);
    console.log(res);
    dispatch({
      type: "AUTH",
      payload: res.data,
    });
    dispatch({ type: "ALERT", payload: { success: "Login Success!" } });
    localStorage.setItem("logged", "true");
  } catch (err) {
    console.log(err.response.data.msg);
    dispatch({ type: "ALERT", payload: { errors: err.response.data.msg } });
  }
};

export const register = (userRegister) => async (dispatch) => {
  const check = validRegister(userRegister);
  if (check.errLength > 0) {
    return dispatch({ type: "ALERT", payload: { errors: check.errMsg } });
  }
  try {
    dispatch({ type: "ALERT", payload: { loading: true } });

    const res = await postAPI("register", userRegister);

    dispatch({ type: "ALERT", payload: { success: res.data.msg } });
  } catch (err) {
    dispatch({ type: "ALERT", payload: { errors: err.response.data.msg } });
  }
};

export const refreshToken = () => async (dispatch) => {
  const logged = localStorage.getItem("logged");
  if (logged !== "true") return;
  try {
    dispatch({ type: "ALERT", payload: { loading: true } });

    const res = await getAPI("refresh_token");

    dispatch({ type: "AUTH", payload: res.data });

    dispatch({ type: "ALERT", payload: {} });
  } catch (err) {
    dispatch({ type: "ALERT", payload: { errors: err.response.data.msg } });
  }
};

export const logout = (token) => async (dispatch) => {
  const result = await checkTokenExp(token, dispatch);
  const access_token = result ? result : token;
  try {
    localStorage.removeItem("logged");
    await getAPI("logout", access_token);
    window.location.href = "/";
  } catch (err) {
    dispatch({ type: "ALERT", payload: { errors: err.response.data.msg } });
  }
};

export const googleLogin = (id_token) => async (dispatch) => {
  try {
    dispatch({ type: "ALERT", payload: { loading: true } });

    const res = await postAPI("google_login", { id_token });

    dispatch({ type: "AUTH", payload: res.data });

    dispatch({ type: "ALERT", payload: { success: res.data.msg } });
    localStorage.setItem("logged", "true");
  } catch (err) {
    dispatch({ type: "ALERT", payload: { errors: err.response.data.msg } });
  }
};
