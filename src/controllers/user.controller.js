 import { asyncHandler } from "../utils/asyncHandler.js";
 import {apiError} from "../utils/apiError.js";
 import {User} from "../models/user.model.js";
 import {apiResponse} from "../utils/apiResponse.js";
 import jwt from "jsonwebtoken"


 const generateAccessandRefreshToken = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const refreshToken = user.generateRefreshToken()
        const accessToken = user.generateAccessToken()

        // to save refershtoken in db 
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave:false})

        return {accessToken,refreshToken}

    } catch (error) {
        throw new apiError(500,"SOMETHING WENT WRONG WHILE GENERATING REFRESH AND ACCESS TOKEN")
    }
 }

const registerUser = asyncHandler( async (req,res) => {
    //  res.status(200).json({
    //     message:"OK"


        // Writing the main controller for registering an user

        /* STEPS TO BE TAKEN:  

            take email password and other details from frontend
            validation - not empty
            check if user already exist- using email or username
            check for avatar : if present upload it to cloudinary
            create user object - create entry in db
            remove password and refresh token field from response
            check for user creation 
            return response
         */
        const{Fullname,email,username,country} = req.body

// to check every field one by one
        // if(Fullname === ""){
        //     throw new apiError(400,"Full name is required")
        // }

// to check all fields simultaneously
    if(
        [Fullname,email,username,Password,country].some((field) =>
            field?.trim() === "")
        )
        {
            throw new apiError(400,"All fields are reuqired")
        }

        // validation
        const existedUser = User.findOne({
            $or: [{email},{username}]
        })
        if(existedUser){
            throw new apiError(409,"User wtith this email or username already exists")
        }
        // create entry in db
        const userEntry = await User.create({
            Fullname,
            email,
            Password,
            country,
            username: username.toLowerCase()
        })

        const isUserCreated = User.findById(userEntry._id).select(
            "-Password -refreshToken"
        )

        if(!isUserCreated){
            throw new apiError(500,"Something went wrong while registering user")
        }

        // return response
        return res.status(201).json(
            new apiResponse(200,isUserCreated,"User registered succesfully")
        )
})


const loginUser = asyncHandler(async (req,res) =>{
    // to do list
    /*
    1. get data from body
    2. username or email login
    3. find the user in db 
    4. check password
    5. generate access and refresh token and give it to user
    6. send cookie
    */

    const {email,username,Password} = req.body

    if(!(username || email)){
        throw new apiError(400,"Username or email is required")
    }

   const userCheckInDB = await User.findOne({
        $or : [{username},{email}] 
    })

    if(!userCheckInDB){
        throw new apiError(404,"user does not exist")
    }

    const isPasswordValid = await User.isPasswordCorrect(Password)

    if(!isPasswordValid){
        throw new apiError(401,"Invalid user credentials")
    }
    const {accessToken,refreshToken} = await  generateAccessandRefreshToken(user._id)

    const loggedInUser  = await User.findById(user._id).select("-Password -refreshToken")

    const options = {
        httpOnly: true,
        secure:true
    }

    return res.status(200).cookie("accessToken",accessToken,options).cookie("refreshtoken",refreshToken,options).json(
        new apiResponse(

            200,{
                user:loggedInUser,accessToken,refreshToken
            },
            "User logged in successfully"
        )
    )

}) 

// log out user
const logoutUser = asyncHandler(async(req,res) => {
    User.findByIdAndUpdate(
        req.user._id,
        {
            $set :{
                refreshToken:undefined
            }
        },
        {
           new:true 
        }
    )
    const options = {
        httpOnly: true,
        secure:true
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new apiResponse(200,{},"User logged Out"))
})

const RefreshAccessToken = asyncHandler(async(req,res) =>{

    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    if(!incomingRefreshToken){
        throw new apiError(401,"unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
        const user = await User.findById(decodedToken?._id)
        if(!user){
            throw new apiError(401,"Invalid refresh token")
        }
    
        if(incomingRefreshToken !== user?.refreshToken){
            throw new apiError(401,"Refresh token is expires or used")
        }
    
        const options = {
            httpOnly:true,
            secure:true
        }
    
        const {accessToken,refreshToken} = await generateAccessandRefreshToken(user._id)
    
        return res.status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",refreshToken,options)
        .json(
            new apiResponse(
                200,
                {
                    accessToken,refreshToken
                },
                "Access token refreshed"
            )
        )
    
    } catch (error) {
        throw new apiError(401,error?.message || "Invalid refresh token")
        
    }
})


const changeCurrentPassword = asyncHandler(async (req,res) =>
    {
    const {oldPassword,newPassword} = req.body
    const user =  await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
    if(!isPasswordCorrect){
        throw new apiError(400,"Invalid old password")
    }
    user.Password = newPassword
    await user.save({validateBeforeSave:false})

    return res
    .status(200)
    .json(new apiResponse(200,{},"Password changed"))
})

const getCurrentUser = asyncHandler(async (req,res) =>{
    return res
    .status(200)
    .json(200,req.user,"current user fetched successfully")
})

// updating text-based data
const updateAccountDetails = asyncHandler(async (req,res) =>{
    const {Fullname,username,email} = req.body

    if(!Fullname || !email || !username){
        throw new apiError(400,"All fields are required")
    }

    const user = User.findByIdAndUpdate(
        req.user?._id,
        {
            $set : {
                Fullname,
                email : email,
                username: username
            }
        },
        {new : true}
    ).select("-Password")

    return res
    .status(200)
    .json(new apiResponse(200,user,"Account details updated successfully"))

})

const getUserPageProfile = asyncHandler(async(req,res) =>{
    const {username} = req.params

    if(!username?.trim()){
        throw new apiError(400,"username is missing")
    }

    const page = await User.aggregate([
        {
            $match:{
                username: username?.toLowerCase()
            }
        },
        {
            $lookup: {
                from : "followUser",
                localField : "_id",
                foreignField: "page",
                as: "followers"
            }
        },
        {
            $lookup:{

                from: "followUser",
                localField: "_id",
                foreignField: "follower",
                as: "followedTo/following"
            }
        },

        {
            $addFields:{
                followersCount : {
                    $size : "$followers",
                },
                
                followingCount: {
                    $size: "$followedTo/following"
                },
                isFollowed:{
                    $cond:{
                        if: {$in: [req.user?._id,"$followers.followed_by_user_id"]},
                        then : true,
                        else: false
                    }
                }
            }
        },

        {
            $project:{
                Fullname : 1,
                username : 1,
                followersCount : 1,
                followingCount:1,
                isFollowed : 1,

            }
        }
    ])

    
if(!page?.length){
    throw new apiError(404,"Page does not exist")
}

return res
.status(200)
.json(new apiResponse(200,"User page fetched successfully"))

})


export {
    registerUser,
    loginUser,
    logoutUser,
    RefreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    getUserPageProfile
}