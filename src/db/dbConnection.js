import mongoose from "mongoose";
import { dbName } from "../constants.js";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.Database_URI}/expBlog`);
        console.log("MongoDB Connected !!");
    } catch (error) {
        console.error("mongoDB connection failed", error);
    }
}

export { connectDB }
