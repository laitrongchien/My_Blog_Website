const Comment = require("../models/commentModel");
const mongoose = require("mongoose");

const Pagination = (req) => {
  let page = Number(req.query.page) * 1 || 1;
  let limit = Number(req.query.limit) * 1 || 4;
  let skip = (page - 1) * limit;

  return { page, limit, skip };
};

exports.createComment = async (req, res) => {
  if (!req.user)
    return res.status(400).json({ msg: "Invalid Authentication." });

  try {
    const { content, blog_id, blog_user_id } = req.body;
    const newComment = new Comment({
      user: req.user._id,
      content,
      blog_id,
      blog_user_id,
    });
    await newComment.save();
    res.json(newComment);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

exports.getComments = async (req, res) => {
  const { limit, skip } = Pagination(req);

  try {
    const data = await Comment.aggregate([
      {
        $facet: {
          totalData: [
            {
              $match: {
                blog_id: new mongoose.Types.ObjectId(req.params.id),
                comment_root: { $exists: false },
                reply_user: { $exists: false },
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user",
              },
            },
            { $unwind: "$user" },
            {
              $lookup: {
                from: "comments",
                let: { cm_id: "$replyCM" },
                pipeline: [
                  { $match: { $expr: { $in: ["$_id", "$$cm_id"] } } },
                  {
                    $lookup: {
                      from: "users",
                      localField: "user",
                      foreignField: "_id",
                      as: "user",
                    },
                  },
                  { $unwind: "$user" },
                  {
                    $lookup: {
                      from: "users",
                      localField: "reply_user",
                      foreignField: "_id",
                      as: "reply_user",
                    },
                  },
                  { $unwind: "$reply_user" },
                ],
                as: "replyCM",
              },
            },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
          ],
          totalCount: [
            {
              $match: {
                blog_id: new mongoose.Types.ObjectId(req.params.id),
                comment_root: { $exists: false },
                reply_user: { $exists: false },
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

    const comments = data[0].totalData;
    const count = data[0].count;

    let total = 0;

    if (count % limit === 0) {
      total = count / limit;
    } else {
      total = Math.floor(count / limit) + 1;
    }

    return res.json({ comments, total });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

exports.replyComment = async (req, res) => {
  if (!req.user)
    return res.status(400).json({ msg: "invalid Authentication." });

  try {
    const { content, blog_id, blog_user_id, comment_root, reply_user } =
      req.body;

    const newComment = new Comment({
      user: req.user._id,
      content,
      blog_id,
      blog_user_id,
      comment_root,
      reply_user: reply_user._id,
    });

    await Comment.findOneAndUpdate(
      { _id: comment_root },
      {
        $push: { replyCM: newComment._id },
      }
    );
    await newComment.save();

    return res.json(newComment);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

exports.updateComment = async (req, res) => {
  if (!req.user)
    return res.status(400).json({ msg: "Invalid Authentication." });

  try {
    const { content } = req.body;

    // Update comment that has _id and belonging to user that active login
    const comment = await Comment.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      { content }
    );

    if (!comment)
      return res.status(400).json({ msg: "Comment does not exits." });

    return res.json({ msg: "Update Success!" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

exports.deleteComment = async (req, res) => {
  if (!req.user) {
    return res.status(400).json({ msg: "Invalid Authentication" });
  }

  try {
    const comment = await Comment.findOneAndDelete({
      _id: req.params.id,
      $or: [{ user: req.user._id }, { blog_user_id: req.user._id }],
    });
    if (!comment)
      return res.status(400).json({ msg: "Comment does not exits." });

    // If is reply comment
    if (comment.comment_root) {
      // update replyCM
      await Comment.findOneAndUpdate(
        { _id: comment.comment_root },
        {
          $pull: { replyCM: comment._id },
        }
      );
    } else {
      // if is root comment
      // delete all comments that _id in replyCM
      await Comment.deleteMany({ _id: { $in: comment.replyCM } });
    }

    return res.json({ msg: "Delete Success!" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
