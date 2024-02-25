import mongoose from "mongoose";

const blogSchema = mongoose.Schema({
    blogTitle: {
        type: String,
        required: true,
        unique: true
    },
    blogContent: {
        type: String,
        required: true,
        unique: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    image: {
        type: String
    }
}, { timestamps: true })

const blogModel = mongoose.model("Blog", blogSchema)

export { blogModel }