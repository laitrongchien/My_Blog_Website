import React from "react";
import { useParams } from "react-router-dom";
import NotFound from "./components/global/NotFound";

const generatePage = (name) => {
  const component = () => require(`./pages/${name}`).default;

  try {
    return React.createElement(component());
  } catch (err) {
    console.log(err);
    return <NotFound />;
  }
};

const PageRender = () => {
  const { page, slug } = useParams();
  console.log(page);

  let name = "";

  if (page) {
    name = slug ? `${page}/[slug]` : `${page}`;
  }

  return generatePage(name);
};

export default PageRender;
