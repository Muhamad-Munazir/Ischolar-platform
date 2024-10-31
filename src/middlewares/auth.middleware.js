import { User } from "../models/user.model"
import { apiError } from "../utils/apiError"
import { asyncHandler } from "../utils/asyncHandler"
import jwt from "jsonwebtoken"
import { User } from "../models/user.model"


export const verifyJWT  = asyncHandler(async(req,res,next) => {
    try {
        const token = req.cookies?.accesstoken || req.haeader("Authorization")?.replace("Bearer ","")
    
        if(!token){
            throw new apiError(401,"Unauthorized request")
        }
        const decodedToken = jwt.verify(token ,process.env.ACCESS_TOKEN_SECRET)
    
        const user =  await User.findById(decodedToken?._id).select("-Password -refreshToken")
    
        if(!user){
            throw new apiError(401,"Invalid Access Token")
        }
        req.user = user;
        next()
    } catch (error) {
        throw new apiError(401,error?.message ||"Invalid Access Token")
        
    }
})