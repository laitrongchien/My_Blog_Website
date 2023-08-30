// import { CREATE_CATEGORY, GET_CATEGORIES } from "../types/categoryType";

const categoryReducer = (state = [], action) => {
  switch (action.type) {
    case "CREATE_CATEGORY":
      return [action.payload, ...state];

    case "GET_CATEGORIES":
      return action.payload;

    default:
      return state;
  }
};

export default categoryReducer;
