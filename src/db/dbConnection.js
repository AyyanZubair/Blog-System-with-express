import mongoose from "mongoose";
<<<<<<< HEAD
=======
import { dbName } from "../constants.js";
>>>>>>> origin/main
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    try {
<<<<<<< HEAD
        await mongoose.connect(`${process.env.Database_URI}/expBlog`);
=======
        await mongoose.connect(`${process.env.Database_URI}/${dbName}`);
>>>>>>> origin/main
        console.log("MongoDB Connected !!");
    } catch (error) {
        console.error("mongoDB connection failed", error);
    }
}

export { connectDB }