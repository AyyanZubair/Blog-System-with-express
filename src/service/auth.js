import jwt from "jsonwebtoken";

const generateToken = async (user_id, username, email, password, userRole) => {
    const payload = {
        user_id, username, email, password, userRole
    }
    return jwt.sign(payload, process.env.secretKey);

}

const verifyToken = async (token) => {
    return jwt.verify(token, process.env.secretKey);


}

export { generateToken, verifyToken }