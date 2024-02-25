import { blogModel } from "../models/blogModel.js";
import { LikesModel } from "../models/likeModel.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addLike = async (req, res) => {
    try {
        const { blogId } = req.params;
        if (!blogId) return res.send(new ApiErrors(400, {}, "blogId is required to like the blog"))
        const existingBlog = await blogModel.findOne({ _id: blogId })
        if (!existingBlog) return res.send(new ApiErrors(400, {}, "Blog which you want to find does not exist"))
        let existingLike = await LikesModel.findOne({ blogId });
        if (!existingLike) {
            await LikesModel.create({
                blogId,
                likes: 1,
                user_ids: [req.isValidToken.user_id]
            })
        } else {
            const alreadyLike = existingLike.user_ids.includes(req.isValidToken.user_id);
            if (alreadyLike) {
                return res.send(new ApiErrors(400, {}, "already liked"))
            } else {
                await LikesModel.findOneAndUpdate({
                    blogId: new Object(blogId)
                }, {
                    $inc: { "likes": 1 },
                    $push: { "user_ids": req.isValidToken.user_id }
                })
            }
        }
        res.send(new ApiResponse(200, "Like Added Successfully!!"))
    } catch (error) {
        console.log("error like blog", error)
        res.send(new ApiErrors(400, {}, "internal server error"))
    }
}

const disLike = async (req, res) => {
    try {
        const { likeId } = req.params;
        if (!likeId) return res.send(new ApiErrors(400, {}, "likeId is required to dislike the blog"))
        const existingBlog = await LikesModel.findOne({ _id: new Object(likeId) })
        if (!existingBlog) return res.send(new ApiErrors(400, {}, "Blog which you want to dislike does not exist"))
        let existingLike = await LikesModel.findOne({ _id: likeId });
        const alreadyDislike = !existingLike.user_ids.includes(req.isValidToken.user_id)
        if (alreadyDislike) return res.send(new ApiErrors(400, {}, "you already dislike the blog"))
        if (existingBlog.likes > 0) {
            const dislike = await LikesModel.findOneAndUpdate({
                _id: new Object(likeId)
            }, {
                $inc: { "likes": -1 },
                $pull: { "user_ids": req.isValidToken.user_id }
            }, { new: true })
            res.send(new ApiResponse(200, dislike, "Blog dislikes successfully!!"))
        } else {
            res.send(new ApiErrors(400, {}, "there is no like on the blog"))
        }

    } catch (error) {
        console.log("error dislike blog", error)
        res.send(new ApiErrors(400, {}, "internal server error"))
    }
}

export { addLike, disLike }