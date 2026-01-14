import jwt from "jsonwebtoken"
export const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        const decoded = await jwt.verify(
            token,
            "token"
        )
        const user = decoded
        req.user = user
        next()
    } catch (error) {
        res.status(401).json({ message: "invalid request..!", error: error.message })
    }
}