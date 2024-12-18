import Post from "../models/post.model.js";

import { errorHandler } from "../utils/error.js";

export const createPost = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not authorized to create a post"));
  }
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, "Title and Content are required"));
  }

  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z-]/g, "-");

  const newPost = new Post({ ...req.body, slug, userId: req.user.id });

  try {
    const savedDraft = await newPost.save();
    res.status(201).json(savedDraft);
  } catch (error) {
    next(error);
  }
};

export const getPosts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const posts = await Post.find({
      ...(req.query.isDraft && { isDraft: req.query.isDraft }),
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await Post.countDocuments({ isDraft: false });
    const totalDrafts = await Post.countDocuments({ isDraft: true });

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
      isDraft: false,
    });

    const lastMonthDrafts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
      isDraft: true,
    });

    res.status(200).json({
      posts,
      totalPosts,
      totalDrafts,
      lastMonthPosts,
      lastMonthDrafts,
    });
  } catch (error) {
    next(error);
  }
};

export const publishPost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(
      errorHandler(403, "You are not authorized to publish this post")
    );
  }
  try {
    const publishPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          isDraft: false,
          title: req.body.title,
          content: req.body.content,
          category: req.body.category,
          image: req.body.image,
        },
      },
      { new: true }
    );
    res.status(200).json(publishPost);
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(
      errorHandler(403, "You are not authorized to delete this post")
    );
  }
  try {
    await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json("The post has been deleted");
  } catch (error) {
    next(error);
  }
};

export const editPost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(
      errorHandler(403, "You are not authorized to publish this post")
    );
  }
  try {
    const editPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          category: req.body.category,
          image: req.body.image,
        },
      },
      { new: true }
    );
    res.status(200).json(editPost);
  } catch (error) {
    next(error);
  }
};
