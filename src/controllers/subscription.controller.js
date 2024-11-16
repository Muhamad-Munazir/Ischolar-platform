import mongoose,{ isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler";
import { apiError } from "../utils/apiError";
import { User } from "../models/user.model";
import { verifyJWT } from "../middlewares/auth.middleware";
import { followUser } from "../models/followUser.model"; 
import { apiResponse } from "../utils/apiResponse";


c
/*
    STEPS: 
    if user1 make a follow request to another user2 then following logic will be applied:

    1. search authentication of user1{is user1 loggedin and a registered user}

    2. add user1's name in FOLLOWERS ARRAY of user2

    3. No need to send a response when successfull{
    instead change colour of follow button :D}
 */

    const toggleSubscription = asyncHandler(async (req,res) => {
        const {channelId} = req.params
        if(!isValidObjectId){
            throw new apiError(400,"Invalid Channel/Page Id")
        }

        const subscribed = await followUser.findOne({
            $and : [{target_user_id : channelId},{followed_by_user_Id: req.user._id}],
        });

        if(!subscribed){
            const subscribe = await followUser.create({
                followed_by_user_Id:req.user._id,
                target_user_id:channelId
            });
            if(!subscribe){
                throw new apiError(500,"Error while subscribing")
            }

            return res
            .status(200)
            .json(new apiResponse(200,subscribe,"Channel/Page Subscribed"))
        }

        const unsubscribe = await followUser.findByIdAndDelete(subscribed._id)
        if(!unsubscribe){
            throw new apiError(500,"Error while Unsubscribing")
        }

        return res
        .status(200)
        .json(new apiResponse(200,"Channel/Page unsubscribed successfully"))

    })


    // controller to return subscriber list of a channel/page
    const getPageSubscribers = asyncHandler(async (req,res) =>{
        const {subscriberId} = req.params
        if(!isValidObjectId(subscriberId)){
            throw new apiError(400,"Invalid subscriber Id")
        }

        const subscriberList = await followUser.aggregate([
            {
            $match:{
                target_user_id : new mongoose.Types.ObjectId(subscriberId)
            }
        
           },
           {
            $lookup: {
                from : "users",
                localField : "follow_by_user_Id",
                foreignField: "_id",
                as : "follow_by_user_Id",
                pipeline : [
                    {
                        $project : {
                            username : 1,
                            FullName : 1,
                        }
                    }
                ]

            }
           },
           {
            $addFields : {
                followed_by_user_Id : {
                    $first : "$followed_by_user_Id"
                }
            }
           }
        ])
        if(!subscriberList){
            throw new apiError(400,"Error Fetching Subscribers list")
        }

        return res
        .status(200)
        .json(
            new apiResponse (200,subscriberList,"Subcribes fetched Succefully")
        )
    })

    // controller to return channel list to which user has subscribed
    const getSubscribedPages = asyncHandler(async(req,res) =>{
        const {channelId} = req.params
        if(!isValidObjectId(channelId)){
            throw new apiError(400,"Invalid Channel/Page Id")
        }

        const channelList = await followUser.aggregate([
            {
                $match: {
                    followed_by_user_Id : channelId
                }
            },
            {
                $lookup : {
                    from : "users",
                    localField: "target_user_id",
                    foreignField: "_id",
                    as : "target_user_id",
                    pipeline: [
                        {
                            $project : {
                                FullName : 1,
                                username : 1,
                            }
                        },
                        
                    ]
                }
            },

                {
                    $addFields : {
                        target_user_id : {
                            $first : "$target_user_id"
                        }
                    }
                },
                {
                    $project : {
                        target_user_id:1,
                        createdAt : 1
                    }
                }
            
        ])
        
        if(!channelList) {
            throw new apiError(400,"Error fetching Subscribed Channels.Pages")
        }

        return res
        .status(200)
        .json(
            new apiResponse(200,channelList,"Subscribed channels/Pages list fetched successfully")
        )
    })

    
export {toggleSubscription,
    getPageSubscribers,
    getSubscribedPages

}