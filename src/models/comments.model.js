import mongoose from "mongoose";

const commentSchema = mongoose.Schema({
    blog_id: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
}, { timestamps: true })

export const commentsModel = mongoose.model("Comments", commentSchema)