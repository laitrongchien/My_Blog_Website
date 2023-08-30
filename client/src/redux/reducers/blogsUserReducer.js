const blogsUserReducer = (state = [], action) => {
  switch (action.type) {
    case "GET_BLOGS_USER_ID":
      if (state.every((item) => item.id !== action.payload.id)) {
        return [...state, action.payload];
      } else {
        return state.map((item) =>
          item.id === action.payload.id ? action.payload : item
        );
      }
    case "CREATE_BLOGS_USER_ID":
      return state.map((item) =>
        item.id === action.payload.user._id
          ? {
              ...item,
              blogs: [action.payload, ...item.blogs],
            }
          : item
      );
    case "UPDATE_BLOGS_USER_ID": {
      // console.log(action.payload); // Add this line to log the payload
      return state.map((item) =>
        item.id === action.payload.user._id
          ? {
              ...item,
              blogs: item.blogs.map((blog) =>
                blog._id === action.payload._id ? action.payload : blog
              ),
            }
          : item
      );
    }
    case "DELETE_BLOGS_USER_ID":
      return state.map((item) =>
        item.id === action.payload.user._id
          ? {
              ...item,
              blogs: item.blogs.filter(
                (blog) => blog._id !== action.payload._id
              ),
            }
          : item
      );
    default:
      return state;
  }
};

export default blogsUserReducer;
