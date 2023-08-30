import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { createCategory } from "../redux/actions/categoryAction";
import NotFound from "../components/global/NotFound";

const Category = () => {
  const [name, setName] = useState("");

  const { auth, categories } = useSelector((state) => state);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!auth.access_token || !name) return;
    // console.log(auth.access_token);

    dispatch(createCategory(name, auth.access_token));

    setName("");
  };

  if (auth.user?.role !== "admin") return <NotFound />;
  return (
    <div className="category">
      <form onSubmit={handleSubmit}>
        <label htmlFor="category">Category</label>

        <div className="d-flex">
          <input
            type="text"
            name="category"
            id="category"
            value={name}
            placeholder="Please add a category"
            style={{ padding: "0 10px" }}
            onChange={(e) => setName(e.target.value)}
          />

          <button type="submit">Create</button>
        </div>
      </form>

      <div>
        {categories.map((category) => (
          <div className="category_row" key={category._id}>
            <p className="m-0 text-capitalize">{category.name}</p>

            <div>
              <i class="fa-solid fa-pen-to-square mx-3 edit_icon"></i>
              <i class="fa-solid fa-trash-can delete_icon"></i>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;
