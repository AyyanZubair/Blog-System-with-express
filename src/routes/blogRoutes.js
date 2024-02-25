import { createBlog, deleteBlog, findAllBlogs, getMyBlogs, totalLikesOnBlog, updateBlog } from "../controllers/blogController.js"
import { Router } from "express"
import { addLike, disLike } from "../controllers/likeController.js";
import { addComment, deleteComment, updateComment } from "../controllers/commentController.js";
import { upload } from "../middlewares/multer.middleware.js"
import { tokenAuth } from "../middlewares/verifyToken.js"
import { roleChecker } from "../middlewares/roleChecker.js";
const router = Router();

router.post("/blogs", upload.single("image"), tokenAuth, createBlog)
router.delete("/blogs/:blogId", tokenAuth, deleteBlog)
router.put("/blogs/:blogId", tokenAuth, updateBlog)
router.get("/blogs/:userId", tokenAuth, roleChecker, findAllBlogs)
router.get("/blogs/:userId/myBlogs", tokenAuth, getMyBlogs)
router.get("/blogs/:blogId/totalLikesOnBlog", tokenAuth, totalLikesOnBlog)
router.post("/blogs/:blogId/like", tokenAuth, addLike)
router.delete("/blogs/:likeId/disLike", tokenAuth, disLike)
router.post("/blogs/:blogId/comment", tokenAuth, addComment)
router.delete("/blogs/:commentId/deleteComment", tokenAuth, deleteComment)
router.put("/blogs/:commentId/updateComment", tokenAuth, updateComment)

export default router;