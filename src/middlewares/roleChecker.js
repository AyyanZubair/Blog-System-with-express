import { userModel } from "../models/userModel.js"
import { ApiErrors } from "../utils/ApiErrors.js"

async function roleChecker(req, res, next) {
    const existingUser = await userModel.findOne({ _id: req.params.userId })
    if (existingUser && existingUser.userRole === "ADMIN") {
        next()
    } else {
        res.status(new ApiErrors(403, {}, "unAuthorized access"))
    }
}

export { roleChecker }