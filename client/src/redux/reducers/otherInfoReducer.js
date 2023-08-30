const otherInfoReducer = (state = [], action) => {
  switch (action.type) {
    case "GET_OTHER_INFO":
      return [...state, action.payload];

    default:
      return state;
  }
};

export default otherInfoReducer;
