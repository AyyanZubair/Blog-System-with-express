import express from "express";
import cookieParser from "cookie-parser";
const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser());
app.use(express.static("./public"));

import userRouter from "./routes/user.routes.js"
import blogRouter from "./routes/blogs.routes.js";
import { upload } from "./middlewares/multer.middleware.js";

app.use("/api/users", userRouter)
app.use("/api/blogs", upload.single("image"), blogRouter)

export { app }