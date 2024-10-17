import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createDraft,
  publishPost,
  getDrafts,
} from "../controllers/post.controller.js";

const router = express.Router();

router.post("/create", verifyToken, createDraft);
router.post("/publish", verifyToken, publishPost);
router.get("/getdrafts", verifyToken, getDrafts);

export default router;
