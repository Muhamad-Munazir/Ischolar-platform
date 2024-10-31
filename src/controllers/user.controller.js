 import { asyncHandler } from "../utils/asyncHandler.js";
 import {apiError} from "../utils/apiError.js";
 import {User} from "../models/user.model.js";
 import {apiResponse} from "../utils/apiResponse.js";


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
        const{Fullname,email,username} = req.body

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

export {
    registerUser,
    loginUser,
    logoutUser
}