import mongoose from "mongoose";

const likesSchema = mongoose.Schema({
    blogId: {
        type: String,
        required: true
    },
    user_ids: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    likes: {
        type: Number,
    }
}, { timestamps: true })

export const LikesModel = mongoose.model("Likes", likesSchema);