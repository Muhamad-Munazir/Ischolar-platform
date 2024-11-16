import { asyncHandler } from "../utils/asyncHandler";
import { verifyJWT } from "../middlewares/auth.middleware";
import { Community } from "../models/community.model";
import { apiError } from "../utils/apiError";
import { apiResponse } from "../utils/apiResponse";
import {v2 as cloudinary} from "cloudinary"




const UploadcommunityPost = asyncHandler(async(req,res) => {
    try {
        const {content,media_url} = req.body
        const newCommunityPost = new newCommunityPost({
            userId : req.user._id,
            content,
            media_url,
            fileUrl: req.file.path,
            fileType : req.file.mimetype
        })


        // save post in DB
        await newCommunityPost.save()

        return res
        .status(200)
        .json(
             new apiResponse(200,newCommunityPost,"Community post uploaded successfully")
        )

    } catch (error) {
        throw new apiError(500,error?.message || "Something went wrong while uploading communtiy post")
    }
})


const RemoveCommunityPost = asyncHandler(async(req,res) => {
    try {
        const {postId} = req.params // postId is communityPost's id

        // find the communityPost by it's _id
        const community = await Community.findById(postId)
        
        if(!community.userId.equals(req.user._id)){
            throw new apiError(403,"You are not authorized to delete this Community post")
        }

        // Delelte file from cloudinary if fileUrl exists

        if(community.fileUrl){
            const publicId = community.fileUrl.split('/').pop().split('.')[0]
            await cloudinary.uploader.destroy(publicId)
        }

        // remove community post from database
        await community.deleteOne()
        return res
        .status(200)
        .json(
            new apiResponse(200,null,"Community post deleted successfully")
        )


    } catch (error) {
        throw new apiError(500, error?.message || "Something went wrong while deleting Community Post")
    }
})

export {
    UploadcommunityPost,
    RemoveCommunityPost
}