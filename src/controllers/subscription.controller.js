import mongoose,{isValidObjectId} from "mongoose";
import { asyncHandler } from "../utils/asynchandler";
import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { Subscription } from "../models/subscription.model";



const toggleSubscription = asyncHandler(async(req,res)=>{
    const {channelId} = req.params;
    if (!channelId?.trim()) {
        throw new ApiError(401, "channelId is required");
      }
      const isValidchannelId = isValidObjectId(channelId);
      if (!isValidchannelId) {
        throw new ApiError(404, "channelId is not valid");
      }

     const subscribedToggle = await User.aggregate([
        {
            $match:{
                _id:new mongoose.Schema.Types.ObjectId(channelId)
            }
        },
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"subscriber",
                as:"Subscribers"
            }
        },
        {
            $addFields:{
                isSubscribed:{
                    $cond:{
                        if:{$in:[req.user?._id,"$Subscribers.subscriber"]},
                        then:true,
                        else:false,
                    }
                }
            }
        },
        {
            $project:{
                isSubscribed:1,
                username:1,
                
            }
        }
      ])
      if(!subscribedToggle?.length){
        throw new ApiError(404,"user doesn't exist")
      }
      return res
      .status(200)
      .json(
        new ApiResponse(200,subscribedToggle,"user subscribed Channels")
      )

}) 

const getUserChannelSubscribers = asyncHandler(async(req,res)=>{
    const {channelId} = req.params
    if (!channelId?.trim()) {
        throw new ApiError(401, "channelId is required");
      }
      const isValidchannelId = isValidObjectId(channelId);
      if (!isValidchannelId) {
        throw new ApiError(404, "channelId is not valid");
      }

      const fetchUserchannelSubscribers = await Subscription.aggregate([
        {
            $match:{
                channel:new mongoose.Schema.Types.ObjectId(channelId)
            }
        },
        {
            $lookup:{
                from:"users",
                localField:"subscriber",
                foreignField:"_id",
                as:"subscriber",
                pipeline:[
                  {
                    $project:{
                      username:1,
                      avatar:1,
                    }
                  }
                ]
            },
        },
        {
          $addFields:{
            subscriber:{
                $first:"$subscriber"
            }
          }
        },
        {
            $project:{
                channel:1,
                subscriber:1,
            }
        }
      ])

      if(!fetchUserchannelSubscribers?.length){
        throw new ApiError(404,"user doesn't exist")
      }

      return res
      .status(200)
      .json(
        new ApiResponse(200,fetchUserchannelSubscribers,"user subscribed Channels")
      )
})

const getSubcribedChannels = asyncHandler(async(req,res)=>{
    const {subscriberId} = req.params
    if (!subscriberId?.trim()) {
        throw new ApiError(401, "subscriberId is required");
      }
      const isValidsubscriberId = isValidObjectId(subscriberId);
      if (!isValidsubscriberId) {
        throw new ApiError(404, "subscriberId is not valid");
      }

      const fetchsubscribedChannels = await Subscription.aggregate([
        {
            $match:{
                subscriber:new mongoose.Schema.Types.ObjectId(subscriberId)
            }
        },
        {
            $lookup:{
                from:"users",
                localField:"channel",
                foreignField:"_id",
                as:"channel",
                pipeline:[
                  {
                    $project:{
                      username:1,
                      avatar:1,
                    }
                  }
                ]
            },
        },
        {
          $addFields:{
            channel:{
                $first:"$channel"
            }
          }
        },
        {
            $project:{
                channel:1,
                subscriber:1,
            }
        }
      ])

      if(!fetchsubscribedChannels?.length){
        throw new ApiError(404,"user doesn't exist")
      }

      return res
      .status(200)
      .json(
        new ApiResponse(200,fetchsubscribedChannels,"user subscribed Channels")
      )
})

export {
    toggleSubscription,
    getSubcribedChannels,
    getUserChannelSubscribers,
}