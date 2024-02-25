import mongoose from "mongoose";

const commentSchema = mongoose.Schema({
    blogId: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    }
}, { timestamps: true })

export const commentsModel = mongoose.model("Comments", commentSchema)