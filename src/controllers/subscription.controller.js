import { asyncHandler } from "../utils/asyncHandler";
import { apiError } from "../utils/apiError";
import { User } from "../models/user.model";
import { verifyJWT } from "../middlewares/auth.middleware";

const followUser = asyncHandler(async(req,res) =>{
/*
    STEPS: 
    if user1 make a follow request to another user2 then following logic will be applied:

    1. search authentication of user1{is user1 loggedin and a registered user}

    2. add user1's name in FOLLOWERS ARRAY of user2

    3. No need to send a response when successfull{
    instead change colour of follow button :D}
 */

try {
    
} catch (error) {
    throw new apiError(500,error?.message || "Sorry something went wrong while subscribing to the user")
    
}






})





const unfollowUser = asyncHandler(async(req,res) =>{

})


export {followUser,
        unfollowUser
}