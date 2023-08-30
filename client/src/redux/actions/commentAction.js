import { postAPI, getAPI, patchAPI, deleteAPI } from "../../utils/FetchData";
import { checkTokenExp } from "../../utils/checkTokenExp";

export const createComment = (data, token) => async (dispatch) => {
  const result = await checkTokenExp(token, dispatch);
  const access_token = result ? result : token;
  try {
    const res = await postAPI("comment", data, access_token);
    // console.log({ ...res.data, user: data.user });

    dispatch({
      type: "CREATE_COMMENT",
      payload: { ...res.data, user: data.user },
    });
  } catch (err) {
    dispatch({ type: "ALERT", payload: { errors: err.response.data.msg } });
  }
};

export const getComments = (id) => async (dispatch) => {
  try {
    let limit = 8;

    const res = await getAPI(`comments/blog/${id}?limit=${limit}`);
    // console.log(res);

    dispatch({
      type: "GET_COMMENTS",
      payload: {
        data: res.data.comments,
        total: res.data.total,
      },
    });
  } catch (err) {
    dispatch({ type: "ALERT", payload: { errors: err.response.data.msg } });
  }
};

export const replyComment = (data, token) => async (dispatch) => {
  const result = await checkTokenExp(token, dispatch);
  const access_token = result ? result : token;
  try {
    const res = await postAPI("reply_comment", data, access_token);

    dispatch({
      type: "REPLY_COMMENT",
      payload: {
        ...res.data,
        user: data.user,
        reply_user: data.reply_user,
      },
    });
  } catch (err) {
    dispatch({ type: "ALERT", payload: { errors: err.response.data.msg } });
  }
};

export const updateComment = (data, token) => async (dispatch) => {
  const result = await checkTokenExp(token, dispatch);
  const access_token = result ? result : token;
  try {
    dispatch({
      type: data.comment_root ? "UPDATE_REPLY" : "UPDATE_COMMENT",
      payload: data,
    });

    await patchAPI(
      `comment/${data._id}`,
      {
        content: data.content,
      },
      access_token
    );
  } catch (err) {
    dispatch({ type: "ALERT", payload: { errors: err.response.data.msg } });
  }
};

export const deleteComment = (data, token) => async (dispatch) => {
  const result = await checkTokenExp(token, dispatch);
  const access_token = result ? result : token;
  try {
    dispatch({
      type: data.comment_root ? "DELETE_REPLY" : "DELETE_COMMENT",
      payload: data,
    });

    await deleteAPI(`comment/${data._id}`, access_token);
  } catch (err) {
    dispatch({ type: "ALERT", payload: { errors: err.response.data.msg } });
  }
};
