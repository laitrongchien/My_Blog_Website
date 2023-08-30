const mongoose = require("mongoose");
const Blog = require("../models/blogModel");
const Comment = require("../models/commentModel");

const Pagination = (req) => {
  let page = Number(req.query.page) * 1 || 1;
  let limit = Number(req.query.limit) * 1 || 4;
  let skip = (page - 1) * limit;

  return { page, limit, skip };
};

exports.createBlog = async (req, res) => {
  if (!req.user)
    return res.status(400).json({ msg: "Invalid Authentication." });

  try {
    const { title, content, description, thumbnail, category } = req.body;

    const newBlog = new Blog({
      user: req.user._id,
      title,
      content,
      description,
      thumbnail,
      category,
    });

    await newBlog.save();
    res.json({
      msg: "Create Success!",
      ...newBlog._doc,
      user: req.user,
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

exports.getHomeBlogs = async (req, res) => {
  try {
    const blogs = await Blog.aggregate([
      // User
      {
        $lookup: {
          from: "users",
          let: { user_id: "$user" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$user_id"] } } },
            { $project: { password: 0 } },
          ],
          as: "user",
        },
      },
      // array -> object
      { $unwind: "$user" },
      // Category
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      // array -> object
      { $unwind: "$category" },
      // Sorting
      { $sort: { createdAt: -1 } },
      // Group by category
      {
        $group: {
          _id: "$category._id",
          name: { $first: "$category.name" },
          blogs: { $push: "$$ROOT" },
          count: { $sum: 1 },
        },
      },
      // Pagination for blogs
      {
        $project: {
          blogs: {
            $slice: ["$blogs", 0, 4],
          },
          count: 1,
          name: 1,
        },
      },
    ]);

    res.json(blogs);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

exports.getBlogsByCategory = async (req, res) => {
  const { limit, skip } = Pagination(req);

  try {
    const Data = await Blog.aggregate([
      {
        $facet: {
          totalData: [
            {
              $match: {
                category: new mongoose.Types.ObjectId(req.params.id),
              },
            },
            // User
            {
              $lookup: {
                from: "users",
                let: { user_id: "$user" },
                pipeline: [
                  { $match: { $expr: { $eq: ["$_id", "$$user_id"] } } },
                  { $project: { password: 0 } },
                ],
                as: "user",
              },
            },
            // array -> object
            { $unwind: "$user" },
            // Sorting
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
          ],
          totalCount: [
            {
              $match: {
                category: new mongoose.Types.ObjectId(req.params.id),
              },
            },
            { $count: "count" },
          ],
        },
      },
      {
        $project: {
          count: { $arrayElemAt: ["$totalCount.count", 0] },
          totalData: 1,
        },
      },
    ]);

    const blogs = Data[0].totalData;
    // console.log(blogs);
    const count = Data[0].count;
    // console.log(count);

    // Pagination
    let total = 0;

    if (count % limit === 0) {
      total = count / limit;
    } else {
      total = Math.floor(count / limit) + 1;
    }

    res.json({ blogs, total });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

exports.getBlogsByUser = async (req, res) => {
  const { limit, skip } = Pagination(req);

  try {
    const Data = await Blog.aggregate([
      {
        $facet: {
          totalData: [
            {
              $match: {
                user: new mongoose.Types.ObjectId(req.params.id),
              },
            },
            // User
            {
              $lookup: {
                from: "users",
                let: { user_id: "$user" },
                pipeline: [
                  { $match: { $expr: { $eq: ["$_id", "$$user_id"] } } },
                  { $project: { password: 0 } },
                ],
                as: "user",
              },
            },
            // array -> object
            { $unwind: "$user" },
            // Sorting
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
          ],
          totalCount: [
            {
              $match: {
                user: new mongoose.Types.ObjectId(req.params.id),
              },
            },
            { $count: "count" },
          ],
        },
      },
      {
        $project: {
          count: { $arrayElemAt: ["$totalCount.count", 0] },
          totalData: 1,
        },
      },
    ]);

    const blogs = Data[0].totalData;
    const count = Data[0].count;

    // Pagination
    let total = 0;

    if (count % limit === 0) {
      total = count / limit;
    } else {
      total = Math.floor(count / limit) + 1;
    }

    res.json({ blogs, total });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

exports.getBlog = async (req, res) => {
  try {
    const blog = await Blog.findOne({ _id: req.params.id }).populate(
      "user",
      "-password"
    );

    if (!blog) return res.status(400).json({ msg: "Blog does not exist." });

    return res.json(blog);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

exports.updateBlog = async (req, res) => {
  if (!req.user)
    return res.status(400).json({ msg: "Invalid Authentication." });

  try {
    const blog = await Blog.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id,
      },
      req.body,
      {
        new: true,
      }
    );

    if (!blog) return res.status(400).json({ msg: "Invalid Authentication." });

    res.json({ msg: "Update Success!", ...blog._doc, user: req.user });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

exports.deleteBlog = async (req, res) => {
  if (!req.user)
    return res.status(400).json({ msg: "Invalid Authentication." });

  try {
    // Delete Blog
    const blog = await Blog.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!blog) return res.status(400).json({ msg: "Invalid Authentication." });

    // Delete Comments
    await Comment.deleteMany({ blog_id: blog._id });

    res.json({ msg: "Delete Success!" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

exports.searchBlogs = async (req, res) => {
  try {
    const blogs = await Blog.aggregate([
      {
        $search: {
          index: "searchTitle",
          autocomplete: {
            query: `${req.query.title}`,
            path: "title",
          },
        },
      },
      { $sort: { createdAt: -1 } },
      { $limit: 5 },
      {
        $project: {
          title: 1,
          description: 1,
          thumbnail: 1,
          createdAt: 1,
        },
      },
    ]);

    if (!blogs.length) return res.status(400).json({ msg: "No Blog Found." });

    res.json(blogs);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
