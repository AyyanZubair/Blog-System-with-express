import { commentsModel } from "../models/commentModel.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { blogModel } from "../models/blogModel.js"


const addComment = async (req, res) => {
    try {
        const { blogId } = req.params
        const { comment } = req.body
        if (!(blogId, comment)) return res.send(new ApiErrors(400, {}, "please give all requirments"))
        const existingBlog = await blogModel.findOne({ _id: new Object(blogId) })
        if (!existingBlog) return res.send(new ApiErrors(400, {}, "blog you want to comment does not exist"))
        await commentsModel.create({
            blogId, comment
        })
        res.send(new ApiResponse(200, {}, "comment added successfully!!"))
    } catch (error) {
        console.log("error comment blog", error)
        res.send(new ApiErrors(400, {}, "internal server error"))
    }
}

const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        if (!commentId) return res.send(new ApiErrors(400, {}, "commentId is required to delete comment"))
        const existingComment = await commentsModel.findOne({ _id: new Object(commentId) })
        if (!existingComment) return res.send(new ApiErrors(400, {}, "comment you want to delete does not exist"))
        await commentsModel.deleteOne({
            _id: new Object(commentId)
        })
        res.send(new ApiResponse(200, {}, "comment deleted successfully!!"))
    } catch (error) {
        console.log("error deleteing comment", error)
        res.send(new ApiErrors(400, {}, "internal server error"))
    }
}

const updateComment = async (req, res) => {
    try {
        const { commentId } = req.params
        const {updatedComment} = req.body
        if (!(commentId || updatedComment)) return res.send(400, {}, "please give all requirments")
        const existingComment = await commentsModel.findOne({ _id: new Object(commentId) })
        if (!existingComment) return res.send(new ApiErrors(400, {}, "comment you want to update does not exist"))
        await commentsModel.findByIdAndUpdate({
            _id: new Object(commentId)
        }, {
            $set: { "comment": updatedComment }
        }, { new: true })
        res.send(new ApiResponse(200, {}, "comment updated successfully"))
    } catch (error) {
        console.log("error updated comment", error)
        res.send(new ApiErrors(400, {}, "internal server error"))
    }
}

export { addComment, deleteComment, updateComment }