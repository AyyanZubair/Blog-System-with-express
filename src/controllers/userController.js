import { userModel } from "../models/userModel.js"
import { ApiErrors } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateToken } from "../service/auth.js"
import bcrypt from "bcrypt";
import slugify from "slugify";

const signUp = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!(username && email && password)) return res.send(new ApiErrors(400, {}, "please fill all requirements"));
        const existingUser = await userModel.findOne({ username, email, password });
        if (existingUser) {
            res.send(new ApiResponse(400, {}, "user already exist"));
        }
        const userRole = "NORMAL"
        const token = await generateToken({}, username, email, password, userRole)
        const hashPassword = await bcrypt.hash(password, 10);
        const userSlug = slugify(username);
        const user = await userModel.create({
            username, email, hashPassword, userRole
        })
        const loggedInUser = await userModel.findOne(user).select("-hashPassword");
        const apiResponse = new ApiResponse(200, token, "you register successfully!!");
        const responseBody = new ApiResponse({ ...apiResponse, userSlug, loggedInUser });
        res.send(responseBody)
    } catch (error) {
        console.error("error while signup", error)
        res.send(new ApiErrors(500, {}, "internal server error"))
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await userModel.findOne({ email });
        if (!existingUser) {
            return res.send(new ApiResponse(400, {}, "Account does not exist"));
        }
        const verifyPassword = await bcrypt.compare(password, existingUser.hashPassword);
        if (!verifyPassword) {
            return res.send(new ApiResponse(400, {}, "Password is incorrect"));
        }
        const token = await generateToken(existingUser._id, email, password);
        const loggedInUser = await userModel.findOne({ _id: existingUser._id }).select("-hashPassword");
        const apiResponse = new ApiResponse(200, token, "You logged in successfully!!");
        const responseBody = new ApiResponse({ ...apiResponse, loggedInUser });

        res.send(responseBody);
    } catch (error) {
        console.error("Login failed", error);
        res.send(new ApiResponse(500, {}, "Login failed"));
    }
};



export { signUp, login }