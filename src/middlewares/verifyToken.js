import { verifyToken } from "../service/auth.js"

async function tokenAuth(req, res, next) {
    const token = req.headers["authorization"].split("Bearer ")[1];
    if (!token) {
        return res.send(new ApiErrors(400, {}, "token not found"));
    }
    const isValidToken = await verifyToken(token)
    if (!isValidToken) {
        return res.send(new ApiErrors(400, {}, "token is wrong, invalid Signature"));
    }
    req.isValidToken = isValidToken
    next()
}

export { tokenAuth }