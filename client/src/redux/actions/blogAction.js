import { imageUpload } from "../../utils/ImageUpload";
import { postAPI, getAPI, putAPI, deleteAPI } from "../../utils/FetchData";
import { checkTokenExp } from "../../utils/checkTokenExp";

export const createBlog = (blog, token) => async (dispatch) => {
  const result = await checkTokenExp(token, dispatch);
  const access_token = result ? result : token;
  let url;
  try {
    dispatch({ type: "ALERT", payload: { loading: true } });

    if (typeof blog.thumbnail !== "string") {
      const photo = await imageUpload(blog.thumbnail);
      url = photo.url;
    } else {
      url = blog.thumbnail;
    }

    const newBlog = { ...blog, thumbnail: url };
    // console.log(newBlog);
    const res = await postAPI("blog", newBlog, access_token);
    dispatch({
      type: "CREATE_BLOGS_USER_ID",
      payload: res.data,
    });
    const result = await getAPI("home/blogs");
    // console.log(result);
    dispatch({
      type: "GET_HOME_BLOGS",
      payload: result.data,
    });
    // dispatch({ type: "ALERT", payload: { loading: false } });
    dispatch({ type: "ALERT", payload: { success: res.data.msg } });
  } catch (err) {
    dispatch({ type: "ALERT", payload: { errors: err.response.data.msg } });
  }
};

export const getHomeBlogs = () => async (dispatch) => {
  try {
    dispatch({ type: "ALERT", payload: { loading: true } });

    const res = await getAPI("home/blogs");
    // console.log(res);

    dispatch({
      type: "GET_HOME_BLOGS",
      payload: res.data,
    });

    dispatch({ type: "ALERT", payload: { loading: false } });
  } catch (err) {
    dispatch({ type: "ALERT", payload: { errors: err.response.data.msg } });
  }
};

export const getBlogsByCategoryId = (id, search) => async (dispatch) => {
  try {
    let limit = 8;
    let value = search ? search : `?page=${1}`;

    dispatch({ type: "ALERT", payload: { loading: true } });

    const res = await getAPI(`blogs/category/${id}${value}&limit=${limit}`);
    console.log(res);
    dispatch({
      type: "GET_BLOGS_CATEGORY_ID",
      payload: { ...res.data, id, search },
    });

    dispatch({ type: "ALERT", payload: { loading: false } });
  } catch (err) {
    dispatch({ type: "ALERT", payload: { errors: err.response.data.msg } });
  }
};

export const getBlogsByUserId = (id, search) => async (dispatch) => {
  try {
    let limit = 3;
    let value = search ? search : `?page=${1}`;

    dispatch({ type: "ALERT", payload: { loading: true } });

    const res = await getAPI(`blogs/user/${id}${value}&limit=${limit}`);

    dispatch({
      type: "GET_BLOGS_USER_ID",
      payload: { ...res.data, id, search },
    });

    dispatch({ type: "ALERT", payload: { loading: false } });
  } catch (err) {
    dispatch({ type: "ALERT", payload: { errors: err.response.data.msg } });
  }
};

export const updateBlog = (blog, token) => async (dispatch) => {
  const result = await checkTokenExp(token, dispatch);
  const access_token = result ? result : token;
  let url;
  try {
    dispatch({ type: "ALERT", payload: { loading: true } });

    if (typeof blog.thumbnail !== "string") {
      const photo = await imageUpload(blog.thumbnail);
      url = photo.url;
    } else {
      url = blog.thumbnail;
    }

    const newBlog = { ...blog, thumbnail: url };
    // console.log(newBlog);

    const res = await putAPI(`blog/${newBlog._id}`, newBlog, access_token);
    // console.log(res);
    dispatch({
      type: "UPDATE_BLOGS_USER_ID",
      payload: res.data,
    });

    const result = await getAPI("home/blogs");
    dispatch({
      type: "GET_HOME_BLOGS",
      payload: result.data,
    });

    dispatch({ type: "ALERT", payload: { success: res.data.msg } });
  } catch (err) {
    dispatch({ type: "ALERT", payload: { errors: err.response.data.msg } });
  }
};

export const deleteBlog = (blog, token) => async (dispatch) => {
  const result = await checkTokenExp(token, dispatch);
  const access_token = result ? result : token;
  try {
    dispatch({
      type: "DELETE_BLOGS_USER_ID",
      payload: blog,
    });

    await deleteAPI(`blog/${blog._id}`, access_token);

    const result = await getAPI("home/blogs");
    dispatch({
      type: "GET_HOME_BLOGS",
      payload: result.data,
    });
  } catch (err) {
    dispatch({ type: "ALERT", payload: { errors: err.response.data.msg } });
  }
};
