import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    hashPassword: {
        type: String,
        required: true,
        unique: false
    },
    userRole: {
        type: String
    }
}, { timestamps: true });

const userModel = mongoose.model("User", userSchema);

export { userModel }