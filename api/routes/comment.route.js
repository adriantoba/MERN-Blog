import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createComment,
  deleteComment,
  editComment,
  getComments,
  getPostComments,
  likeComment,
  approveComments,
} from "../controllers/comment.controller.js";

const router = express.Router();

router.post("/create", verifyToken, createComment);
router.get("/getPostComments/:postId", getPostComments);
router.put("/likeComment/:commentId", verifyToken, likeComment);
router.put("/editComment/:commentId", verifyToken, editComment);
router.delete("/deleteComment/:commentId", verifyToken, deleteComment);
router.get("/getcomments", verifyToken, getComments);
router.put("/approveComments/:commentId", verifyToken, approveComments);

export default router;
