import jwt from "jsonwebtoken"
export const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        if(!token){
            return res.status(404).json({message:"Unauthorized!, token not found..!"})
        }
        const decoded = await jwt.verify(
            token,
            "token"
        )
       req.user = {
      id: decoded.userId
    }
        next()
    } catch (error) {
        res.status(401).json({ message: "invalid request..!", error: error.message })
    }
}