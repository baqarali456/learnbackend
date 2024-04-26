import mongoose from "mongoose";
import { asyncHandler } from "../utils/asynchandler";
import { Video } from "../models/video.model";
import { ApiResponse } from "../utils/ApiResponse";
import { Subscription } from "../models/subscription.model";
import { ApiError } from "../utils/ApiError";



const getChannelStats = asyncHandler(async (req, res) => {
    //Todo: Get the channnel stats like total videos views,total subscriber,total videos ,total likes

    try {
        // total videos views
        const gettotalvideosviews = await Video.aggregate([
            {
                $match: {
                    owner: new mongoose.Schema.Types.ObjectId(req.user?._id)
                },
            },
            {
                $group: {
                    _id: null,
                    sumofviews: {
                        $sum: "$views"
                    }
                }
            },

        ])
        // total videos
        const gettotalvideos = await Video.aggregate([
            {
                $match: {
                    owner: new mongoose.Schema.Types.ObjectId(req.user?._id)
                }
            },
            {
                $group: {
                    _id: owner,
                    totalVideos: {
                        $sum: 1
                    }
                }
            },

        ])
        // total likes
        const TotalLikes = await Like.aggregate([
            {
                $match: {
                    likedBy: new mongoose.Schema.Types.ObjectId(req.user?._id)
                }
            },
            {
                $group: {
                    _id: null,
                    totalLikes: {
                        $sum: 1,
                    }
                }
            }
        ])

        // total subscriber
        const TotalSubscribers = await Subscription.aggregate([
            {
                $match: {
                    channel: new mongoose.Schema.Types.ObjectId(req.user?._id)
                }
            },
            {
                $group: {
                    _id: null,
                    totalSubscribers: {
                        $sum: 1,
                    }
                }
            }
        ])

        return res
            .status(200)
            .json(
                new ApiResponse(200,
                    {
                        totalVideosViews: gettotalvideosviews[0].sumofviews || 0,
                        TotalSubscribers:TotalSubscribers[0].
                        totalSubscribers || 0,
                        TotalLikes:TotalLikes[0].
                        totalLikes || 0,
                        gettotalvideos:gettotalvideos[0].totalVideos || 0,

                    }
                    , "user get channel dashboard details successfully")
            )

    } catch (error) {
        throw new ApiError(500, error.message || "something went wrong while user get channel dashboard details")
    }


})

const getChannelVideos = asyncHandler(async (req, res) => {
    // Todo:Get all the videos uploaded by the channel
    const channelvideos = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Schema.Types.ObjectId(req.user?._id)
            }
        },
        {
            $project: {
                videoFile: 1,
                thumbnail: 1,
            }
        }

    ])

    return res
        .status(200)
        .json(
            new ApiResponse(200, channelvideos, "successfully get channel videos")
        )
})

export {
    getChannelStats,
    getChannelVideos
}