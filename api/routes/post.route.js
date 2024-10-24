import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createPost,
  publishPost,
  getPosts,
  deletePost,
  editPost,
} from "../controllers/post.controller.js";

const router = express.Router();

router.post("/create", verifyToken, createPost);
router.get("/getpost", getPosts);
router.put("/publish/:postId/:userId", verifyToken, publishPost);
router.put("/editpost/:postId/:userId", verifyToken, editPost);
router.delete("/deletepost/:postId/:userId", verifyToken, deletePost);

export default router;
