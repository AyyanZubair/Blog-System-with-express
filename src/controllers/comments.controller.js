import { commentsModel } from "../models/comments.model.js";
import { verifyToken } from "../service/auth.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { blogModel } from "../models/blog.model.js"


const addComment = asyncHandler(async (req, res) => {
    try {
        const { blog_id, content } = req.body;
        if (!(blog_id, content)) return res.send(new ApiErrors(400, {}, "please give all requirments"))
        const token = req.headers["authorization"].split("Bearer ")[1]
        if (!token) return res.send(new ApiErrors(400, {}, "token not found"))
        const verify_Token = await verifyToken(token);
        if (!verify_Token) return res.send(new ApiErrors(400, {}, "token is wrong, invalid signature"))
        const existingBlog = await blogModel.findOne({ _id: new Object(blog_id) })
        if (!existingBlog) return res.send(new ApiErrors(400, {}, "blog you want to comment does not exist"))
        await commentsModel.create({
            blog_id, content
        })
        res.send(new ApiResponse(200, {}, "comment added successfully!!"))
    } catch (error) {
        console.log("error comment blog", error)
        res.send(new ApiErrors(400, {}, "internal server error"))
    }
})

const deleteComment = asyncHandler(async (req, res) => {
    try {
        const { comment_id } = req.body;
        if (!comment_id) return res.send(new ApiErrors(400, {}, "comment_id is required to delete comment"))
        const token = req.headers["authorization"].split("Bearer ")[1]
        if (!token) return res.send(new ApiErrors(400, {}, "token not found"))
        const verify_Token = await verifyToken(token)
        if (!verify_Token) return res.send(new ApiErrors(400, {}, "token is wrong, invalid signature"))
        const existingComment = await commentsModel.findOne({ _id: new Object(comment_id) })
        if (!existingComment) return res.send(new ApiErrors(400, {}, "comment you want to delete does not exist"))
        await commentsModel.deleteOne({
            _id: new Object(comment_id)
        })
        res.send(new ApiResponse(200, {}, "comment deleted successfully!!"))
    } catch (error) {
        console.log("error deleteing comment", error)
        res.send(new ApiErrors(400, {}, "internal server error"))
    }
})

const updateComment = asyncHandler(async (req, res) => {
    try {
        const { comment_id, updatedComment } = req.body;
        if (!(comment_id || updatedComment)) return res.send(400, {}, "please give all requirments")
        const token = req.headers["authorization"].split("Bearer ")[1]
        if (!token) return res.send(new ApiErrors(400, {}, "token not found"))
        const verify_Token = await verifyToken(token)
        if (!verify_Token) return res.send(new ApiErrors(400, {}, "token is wrong, invalid signature"))
        const existingComment = await commentsModel.findOne({ _id: new Object(comment_id) })
        if (!existingComment) return res.send(new ApiErrors(400, {}, "comment you want to update does not exist"))
        await commentsModel.findByIdAndUpdate({
            _id: new Object(comment_id)
        }, {
            $set: { "content": updatedComment }
        }, { new: true })
        res.send(new ApiResponse(200, {}, "comment updated successfully"))
    } catch (error) {
        console.log("error updated comment", error)
        res.send(new ApiErrors(400, {}, "internal server error"))
    }
})

export { addComment, deleteComment, updateComment }