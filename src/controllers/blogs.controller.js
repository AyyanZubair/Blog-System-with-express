import { asyncHandler } from "../utils/asyncHandler.js";
import { blogModel } from "../models/blog.model.js";
import { verifyToken } from "../service/auth.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { userModel } from "../models/users.model.js";

const createBlog = asyncHandler(async (req, res) => {
    try {
        const { blogTitle, blogContent } = req.body;
        if (!(blogTitle || blogContent)) return new ApiErrors(400, {}, "please give all requirments");
        const token = req.headers["authorization"].split("Bearer ")[1];
        if (!token) {
            return res.send(new ApiErrors(400, {}, "token not found"));
        }
        const verify_Token = await verifyToken(token)
        if (!verify_Token) {
            return res.send(new ApiErrors(400, {}, "token is wrong, invalid Signature"));
        }
        const blog = await blogModel.create({
            user_id: verify_Token.user_id, blogTitle, blogContent
        })
        res.send(new ApiResponse(200, blog, "blog created successfully"));
    } catch (error) {
        console.log("error creating blog", error);
        res.send(new ApiErrors(400, {}, "internal server error"))
    }

})

const deleteBlog = asyncHandler(async (req, res) => {
    try {
        const { blog_id } = req.body;
        const token = req.headers["authorization"].split("Bearer ")[1];
        if (!token) {
            return res.send(new ApiErrors(400, {}, "token not found"))
        }
        const verify_Token = await verifyToken(token);
        if (!verify_Token) {
            return res.send(new ApiErrors(400, {}, "token is wrong, invalid signature"))
        }
        const existingBlog = await blogModel.findOne({ _id: new Object(blog_id) });
        if (!existingBlog) {
            return res.send(new ApiErrors(400, {}, "blog which you want to delete are not exist"));
        }
        await blogModel.deleteOne({
            _id: new Object(blog_id)
        })
        res.send(new ApiResponse(200, {}, "Blog Deleted Successfully!!"))
    } catch (error) {
        console.log("error deleteing blog", error)
        res.send(new ApiErrors(400, {}, "internal server error"))
    }
})

const updateBlog = asyncHandler(async (req, res) => {
    try {
        const { blog_id, updatedTitle, updatedContent } = req.body;
        if (!(updatedTitle || updatedContent)) return res.send(new ApiErrors(400, {}, "plzz give all requirements"))
        const token = req.headers["authorization"].split("Bearer ")[1]
        if (!token) return res.send(new ApiErrors(400, {}, "token not found"))
        const verify_Token = await verifyToken(token);
        if (!verify_Token) return res.send(new ApiErrors(400, {}, "token is wrong , invalid signature"))
        const existingBlog = await blogModel.findOne({ _id: new Object(blog_id) })
        if (!existingBlog) return res.send(new ApiErrors(400, {}, "Blog which you want to update are not exist"))
        const updatedBlog = await blogModel.updateOne({
            _id: new Object(blog_id),
        }, {
            $set: { blogTitle: updatedTitle, blogContent: updatedContent }
        })
        res.send(new ApiResponse(200, updatedBlog, "Blog Updated Successfully!!"))
    } catch (error) {
        console.log("error updating blog", error)
        res.send(new ApiErrors(400, {}, "internal server error"))
    }
})

const findAllBlogs = asyncHandler(async (req, res) => {
    try {
        const { user_id } = req.body;
        if (!user_id) return res.send(new ApiErrors(400, {}, "user_id is required to find all blogs"))
        const token = req.headers["authorization"].split("Bearer ")[1]
        if (!token) return res.send(new ApiErrors(400), {}, "token not found")
        const verify_Token = await verifyToken(token)
        if (!verify_Token) return res.send(new ApiErrors(400, {}, "token is wrong, invalid signature"))
        const existingUser = await userModel.findOne({ _id: new Object(user_id) })
        if (existingUser && existingUser.userRole === "ADMIN") {
            const allBlogs = await blogModel.find({})
            res.send(new ApiResponse(200, allBlogs, "all blogs are fetched successfully"))

        } else {
            res.send(new ApiErrors(403, {}, "UnAuthorized access!"))
        }
    } catch (error) {
        console.log("error fetching blogs", error)
        res.send(new ApiErrors(500, {}, "internal server error"))
    }
})

const getMyBlogs = asyncHandler(async (req, res) => {
    const { user_id } = req.body
    if (!user_id) return res.send(new ApiErrors(400, {}, 'user_id is required to find your blogs'))
    const token = req.headers["authorization"].split("Bearer ")[1]
    if (!token) return res.send(new ApiErrors(400, {}, "token not found"))
    const verify_Token = await verifyToken(token);
    if (!verify_Token) return res.send(new ApiErrors(400, {}, "token is wrong, invalid signature"))
    const existingUser = await userModel.findOne({ _id: new Object(user_id) });
    if (!existingUser) return res.send(new ApiErrors(400, {}, "user not found"))
    const myBlogs = await blogModel.find({ user_id: user_id })
    res.send(new ApiResponse(200, myBlogs, "here is your blogs"))
})

export { createBlog, deleteBlog, updateBlog, findAllBlogs, getMyBlogs }