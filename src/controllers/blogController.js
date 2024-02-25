import { blogModel } from "../models/blogModel.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { userModel } from "../models/userModel.js";
import { LikesModel } from "../models/likeModel.js";

const createBlog = async (req, res) => {
    try {
        const { Title, Content } = req.body;
        if (!(Title || Content)) return new ApiErrors(400, {}, "please give all requirments");

        const blog = await blogModel.create({
            user_id: req.isValidToken.user_id, Title, Content
        })
        res.send(new ApiResponse(200, blog, "blog created successfully"));
    } catch (error) {
        console.log("error creating blog", error);
        res.send(new ApiErrors(400, {}, "internal server error"))
    }

}

const deleteBlog = async (req, res) => {
    try {
        const { blogId } = req.params;
        const existingBlog = await blogModel.findOne({ _id: blogId });
        if (!existingBlog) {
            return res.send(new ApiErrors(400, {}, "blog which you want to delete are not exist"));
        }
        await blogModel.deleteOne({
            _id: new Object(blogId)
        })
        res.send(new ApiResponse(200, {}, "Blog Deleted Successfully!!"))
    } catch (error) {
        console.log("error deleteing blog", error)
        res.send(new ApiErrors(400, {}, "internal server error"))
    }
}

const updateBlog = async (req, res) => {
    try {
        const { blogId } = req.params;
        const { updatedTitle, updatedContent } = req.body
        if (!(updatedTitle || updatedContent)) return res.send(new ApiErrors(400, {}, "plzz give all requirements"))
        const existingBlog = await blogModel.findOne({ _id: blogId })
        if (!existingBlog) return res.send(new ApiErrors(400, {}, "Blog which you want to update are not exist"))
        const updatedBlog = await blogModel.updateOne({
            _id: new Object(blogId),
        }, {
            $set: { Title: updatedTitle, Content: updatedContent }
        })
        res.send(new ApiResponse(200, updatedBlog, "Blog Updated Successfully!!"))
    } catch (error) {
        console.log("error updating blog", error)
        res.send(new ApiErrors(400, {}, "internal server error"))
    }
}

const findAllBlogs = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) return res.send(new ApiErrors(400, {}, "userId is required to find all blogs"));

        const existingUser = await userModel.findOne({ _id: userId });
        if (!existingUser) {
            return res.send(new ApiErrors(404, {}, "User not found"));
        }

        if (existingUser.userRole === "ADMIN") {
            const allBlogs = await blogModel.find({});
            return res.send(new ApiResponse(200, allBlogs, "All blogs are fetched successfully"));
        } else {
            // Use the 'user_id' field to query the user's blogs
            const userBlogs = await blogModel.find({ user_id: userId });
            return res.send(new ApiResponse(200, userBlogs, "Blogs created by the user are fetched successfully"));
        }
    } catch (error) {
        console.log("Error fetching blogs", error);
        res.send(new ApiErrors(500, {}, "Internal server error"));
    }
}


const getMyBlogs = async (req, res) => {
    const { userId } = req.params
    if (!userId) return res.send(new ApiErrors(400, {}, 'user_id is required to find your blogs'))
    const existingUser = await userModel.findOne({ _id: new Object(userId) });
    if (!existingUser) return res.send(new ApiErrors(400, {}, "user not found"))
    const myBlogs = await blogModel.find({ user_id: userId })
    if (myBlogs.length === 0) return res.send(new ApiErrors(400, {}, "you don't have any blogs"))
    res.send(new ApiResponse(200, myBlogs, "here is your blogs"))
}

const totalLikesOnBlog = async (req, res) => {
    const { blogId } = req.params;
    if (!blogId) return res.send(new ApiErrors(400, {}, "blog_id is required to find total likes on blog"))
    const existingBlog = await blogModel.findOne({ _id: new Object(blogId) })
    if (!existingBlog) return res.send(new ApiErrors(400, {}, "blog not exist"))
    const blog = await LikesModel.findOne({ blogId })
    const totalLikes = blog.user_ids.length
    res.send(new ApiResponse(200, {}, `total likes on blog are: ${totalLikes}`))
}

export { createBlog, deleteBlog, updateBlog, findAllBlogs, getMyBlogs, totalLikesOnBlog }