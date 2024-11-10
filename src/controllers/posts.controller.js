import { asyncHandler } from "../utils/asyncHandler";
import { apiError } from "../utils/apiError";
import { Publication } from "../models/publication.model";
import { apiResponse } from "../utils/apiResponse";
import { User } from "../models/user.model";
import { upload } from "multer";
import { fileUploadOnCloudinary } from "../utils/cloudinary.service";
import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
import { verifyJWT } from "../middlewares/auth.middleware";
import { equal } from "assert";


const postUpload = asyncHandler(async (req,res) =>{
    // STEPS TO BE TAKEN
    /*  
    check if user is logged in 
    pick file from user's local storage
    upload on cloudinary
    check for file upload completion
    return URL of file as response 
    create entry of URL of file in DB
     */    

   
                 // we can remove this part as authentication work is done by verifyJWT, also The user information is already accessible via req.user, which was set by the middleware. 
    /*
            const {email,username} = req.body
        const isUserLoggedIn = await User.findOne({
        $or : [{email},{username}]
    });

    if(!isUserLoggedIn){
        throw new apiError(401,"Sorry! You are not logged in")
    }

     */
     try {
        const {caption,title} = req.body;
        
        const newPost = new post({
    
            userId : req.user._id,
            caption,
            title,
            fileUrl : req.file.path,  // cloudinary URL
            fileType : req.file.mimetype        
        });
      
        // save post in database 
        await newPost.save();
           
        return res
            .status(200)
            .json(new apiResponse(201,newPost,"Post uploaded successfully"))
        
     } 
     catch (error) {
        throw new apiError(500,error?.message || "Something went wrong while uploading the post")
     }
})
         
const publicationRemove = asyncHandler(async(req,res) =>{
        try {
            const {postId} = req.params   // postId is publication's _id

            // Find the publication by its _id
            const publication = await Publication.findById(postId)

            if(!publication.userId.equals(req.user._id)){
                throw new apiError(403,"You are not authorized to delete this publication")
            }

            // Delete file from Cloudinary if fileUrl exists
            if(publication.fileUrl){
                const publicId = publication.fileUrl.split('/').pop().split('.')[0]
                await cloudinary.uploader.destroy(publicId)
            }

            // Remove publication from database
            await publication.deleteOne()

            return res
            .status(200)
            .json(new apiResponse(200,null,"Publication deleted successfully"))

        } catch (error) {
            throw new apiError(500,error?.message || "Something went wrong while deleting a publication" )
        }
})
         
         
export {
    postUpload,
    postRemove
} 
         
         






