import mongoose from "mongoose";

const blogSchema = mongoose.Schema({
    Title: {
        type: String,
        required: true,
    },
    Content: {
        type: String,
        required: true,
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