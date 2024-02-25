import userRouter from "./src/routes/userRoutes.js"
import blogRouter from "./src/routes/blogRoutes.js";
import { connectDB } from "./src/db/dbConnection.js";
import express from "express";
const app = express();

import dotenv from "dotenv";

dotenv.config();

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static("./public"));

app.use("/api/users", userRouter)
app.use("/api", blogRouter)

connectDB().then(() => {
    app.listen(process.env.PORT || 7000, () => {
        console.log(`server started!!`);
    })
})
    .catch((error) => {
        console.log("Mongo DB connection failed!", error);
    })


