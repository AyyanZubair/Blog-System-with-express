import { blogModel } from "../models/blog.model.js";
import { LikesModel } from "../models/likes.model.js";
import { verifyToken } from "../service/auth.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addLike = asyncHandler(async (req, res) => {
    try {
        const { blog_id } = req.body;
        if (!blog_id) return res.send(new ApiErrors(400, {}, "blog_id is required to like the blog"))
        const token = req.headers["authorization"].split("Bearer ")[1]
        if (!token) return res.send(new ApiErrors(400, {}, "token not found"))
        const verify_Token = await verifyToken(token);
        if (!verify_Token) return res.send(new ApiErrors(400, {}, "token is wrong, invalid signature"))
        const existingBlog = await blogModel.findOne({ _id: new Object(blog_id) })
        if (!existingBlog) return res.send(new ApiErrors(400, {}, "Blog which you want to find does not exist"))
        let existingLike = await LikesModel.findOne({ blog_id });
        if (!existingLike) {
            await LikesModel.create({
                blog_id,
                $inc: { "likes": 1 }
            })
        } else {
            const alreadyLike = existingLike.user_ids.includes(verify_Token.user_id);
            if (alreadyLike) {
                return res.send(new ApiErrors(400, {}, "already liked"))
            }
        }
        await LikesModel.findOneAndUpdate({
            blog_id: new Object(blog_id)
        }, {
            $inc: { "likes": 1 },
            $push: { "user_ids": verify_Token.user_id }
        })
        res.send(new ApiResponse(200, "Like Added Successfully!!"))
    } catch (error) {
        console.log("error like blog", error)
        res.send(new ApiErrors(400, {}, "internal server error"))
    }
})

const disLike = asyncHandler(async (req, res) => {
    try {
        const { like_id } = req.body;
        if (!like_id) return res.send(new ApiErrors(400, {}, "like_id is required to dislike the blog"))
        const token = req.headers["authorization"].split("Bearer ")[1]
        if (!token) return res.send(new ApiErrors(400, {}, "token not found"))
        const verify_Token = await verifyToken(token);
        if (!verify_Token) return res.send(new ApiErrors(400, {}, "token is wrong, invalid signature"))
        const existingBlog = await LikesModel.findOne({ _id: new Object(like_id) })
        if (!existingBlog) return res.send(new ApiErrors(400, {}, "Blog which you want to dislike does not exist"))
        if (existingBlog.likes > 0) {
            const dislike = await LikesModel.findOneAndUpdate({
                _id: new Object(like_id)
            }, {
                $inc: { "likes": -1 },
                $pull: { "user_ids": verify_Token.user_id }
            }, { new: true })
            res.send(new ApiResponse(200, dislike, "Blog dislikes successfully!!"))
        } else {
            res.send(new ApiErrors(400, {}, "there is no like on the blog"))
        }

    } catch (error) {
        console.log("error dislike blog", error)
        res.send(new ApiErrors(400, {}, "internal server error"))
    }
})

export { addLike, disLike }