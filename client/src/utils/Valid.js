export const validRegister = (userRegister) => {
  const { name, account, password, cf_password } = userRegister;
  const errors = [];

  if (!name) {
    errors.push("Please add your name.");
  } else if (name.length > 20) {
    errors.push("Your name is up to 20 chars long.");
  }

  if (!account) {
    errors.push("Please add your username.");
  }

  if (password.length < 6) {
    errors.push("Password must be at least 6 chars.");
  } else if (password !== cf_password) {
    errors.push("Confirm password did not match.");
  }

  return {
    errMsg: errors,
    errLength: errors.length,
  };
};

// Valid Blog
export const validCreateBlog = ({
  title,
  content,
  description,
  thumbnail,
  category,
}) => {
  const err = [];

  if (title.trim().length < 10) {
    err.push("Title has at least 10 characters.");
  } else if (title.trim().length > 100) {
    err.push("Title is up to 100 characters long.");
  }

  if (content.trim().length < 200) {
    err.push("Content has at least 200 characters.");
  }

  if (description.trim().length < 50) {
    err.push("Description has at least 50 characters.");
  } else if (description.trim().length > 200) {
    err.push("Description is up to 200 characters long.");
  }

  if (!thumbnail) {
    err.push("Thumbnail cannot be left blank.");
  }

  if (!category) {
    err.push("Category cannot be left blank.");
  }

  return {
    errMsg: err,
    errLength: err.length,
  };
};

// Content equality
export const contentEqual = (object1, object2) => {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let key of keys1) {
    if (object1[key] !== object2[key]) {
      return false;
    }
  }

  return true;
};
