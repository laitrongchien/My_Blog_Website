import { getAPI } from "../../utils/FetchData";

export const getOtherInfo = (id) => async (dispatch) => {
  try {
    dispatch({ type: "ALERT", payload: { loading: true } });

    const res = await getAPI(`user/${id}`);

    dispatch({
      type: "GET_OTHER_INFO",
      payload: res.data,
    });

    dispatch({ type: "ALERT", payload: {} });
  } catch (err) {
    dispatch({ type: "ALERT", payload: { errors: err.response.data.msg } });
  }
};
