import { createBlog, deleteBlog, findAllBlogs, getMyBlogs, updateBlog } from "../controllers/blogs.controller.js"
import { Router } from "express"
import { addLike, disLike } from "../controllers/likes.controller.js";
import { addComment, deleteComment, updateComment } from "../controllers/comments.controller.js";
const router = Router();

router.route("/createBlog").post(createBlog)
router.route("/deleteBlog").post(deleteBlog)
router.route("/updateBlog").post(updateBlog)
router.route("/allBlogs").get(findAllBlogs)
router.route("/myBlogs").post(getMyBlogs)
router.route("/addLike").post(addLike)
router.route("/disLike").post(disLike)
router.route("/addComment").post(addComment)
router.route("/deleteComment").post(deleteComment)
router.route("/updateComment").post(updateComment)

export default router;