import { postAPI, getAPI } from "../../utils/FetchData";
import { checkTokenExp } from "../../utils/checkTokenExp";

export const createCategory = (name, token) => async (dispatch) => {
  const result = await checkTokenExp(token, dispatch);
  const access_token = result ? result : token;
  try {
    dispatch({ type: "ALERT", payload: { loading: true } });

    const res = await postAPI("category", { name }, access_token);

    dispatch({
      type: "CREATE_CATEGORY",
      payload: res.data.newCategory,
    });

    dispatch({ type: "ALERT", payload: { loading: false } });
  } catch (err) {
    dispatch({ type: "ALERT", payload: { errors: err.response.data.msg } });
    console.error(err);
  }
};

export const getCategories = () => async (dispatch) => {
  try {
    dispatch({ type: "ALERT", payload: { loading: true } });

    const res = await getAPI("category");
    console.log(res);

    dispatch({
      type: "GET_CATEGORIES",
      payload: res.data.categories,
    });

    dispatch({ type: "ALERT", payload: { loading: false } });
  } catch (err) {
    dispatch({ type: "ALERT", payload: { errors: err.response.data.msg } });
  }
};
