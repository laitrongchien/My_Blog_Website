import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import NotFound from "../components/global/NotFound";
import CreateForm from "../components/cards/CreateForm";
import CardHoriz from "../components/cards/CardHoriz";
import QuillField from "../components/editor/ReactQuill";

import { validCreateBlog, contentEqual } from "../utils/Valid";
import { getAPI } from "../utils/FetchData";
import { createBlog, updateBlog } from "../redux/actions/blogAction";

const CreateBlog = ({ id }) => {
  const initState = {
    user: "",
    title: "",
    content: "",
    description: "",
    thumbnail: "",
    category: "",
    createdAt: new Date().toISOString(),
  };

  const [blog, setBlog] = useState(initState);
  const [body, setBody] = useState("");
  const [oldData, setOldData] = useState(initState);

  const divRef = useRef(null);
  const [text, setText] = useState("");

  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!id) return;

    getAPI(`blog/${id}`)
      .then((res) => {
        setBlog(res.data);
        setBody(res.data.content);
        setOldData(res.data);
      })
      .catch((err) => console.log(err));

    return () => {
      setBlog(initState);
      setBody("");
      setOldData(initState);
    };
  }, [id]);

  useEffect(() => {
    const div = divRef.current;
    if (!div) return;

    const text = div?.innerText;
    setText(text);
  }, [body]);

  const handleSubmit = async () => {
    if (!auth.access_token) return;

    const check = validCreateBlog({ ...blog, content: text });
    if (check.errLength !== 0) {
      return dispatch({ type: "ALERT", payload: { errors: check.errMsg } });
    }

    let newData = { ...blog, content: body };

    if (id) {
      if (blog.user._id !== auth.user?._id)
        return dispatch({
          type: "ALERT",
          payload: { errors: "Invalid Authentication." },
        });

      const result = contentEqual(oldData, newData);
      if (result)
        return dispatch({
          type: "ALERT",
          payload: { errors: "The data does not change." },
        });

      dispatch(updateBlog(newData, auth.access_token));
    } else {
      dispatch(createBlog(newData, auth.access_token));
    }
  };

  if (!auth.access_token) return <NotFound />;
  return (
    <div className="my-4 create_blog container">
      <div className="row mt-4">
        <div className="col-md-6">
          <h5>Create</h5>
          <CreateForm blog={blog} setBlog={setBlog} />
        </div>

        <div className="col-md-6">
          <h5>Preview</h5>
          <CardHoriz blog={blog} />
        </div>
      </div>
      <QuillField setBody={setBody} body={body} />
      <div
        ref={divRef}
        dangerouslySetInnerHTML={{
          __html: body,
        }}
        style={{ display: "none" }}
      />
      <small>{text.length}</small>

      <button
        className="btn btn-primary mt-3 d-block mx-auto"
        onClick={handleSubmit}
      >
        {id ? "Update" : "Create"}
      </button>
    </div>
  );
};

export default CreateBlog;
