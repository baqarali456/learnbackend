import mongoose, { mongo } from "mongoose";
import { asyncHandler } from "../utils/asynchandler.js";
import { Video } from "../models/video.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";




const getChannelStats = asyncHandler(async (req, res) => {
    //Todo: Get the channnel stats like total videos views,total subscriber,total videos ,total likes

    try {
        const videos = await Video.find({ owner: req.user?._id })
        const totalViews = videos.reduce((acc, video) => acc + video.views, 0);
        const totalvideos = videos.length;
        // const useruploadedVideos = videos.map(video => video._id);


        const findChannelSubscribers = await Subscription.find({ channel: req.user?._id });
        const totalChannelSubscriber = findChannelSubscribers.length;

        const findtotalLikesinVideos = await Video.aggregate([
            {
                $match: {
                    owner: new mongoose.Schema.Types.ObjectId(req.user?._id)
                }
            },
            {
                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "video",
                    as: "VideoLikes"
                }
            },
            {
                $addFields: {
                    totallikesinSingleVideo: {
                        $size: "$VideoLikes",
                    }
                }
            },
            {
                $group: {
                    id: null,
                    channelTotalLikesofVideo: {
                        totalLikesofChannelVideos: {
                            $sum: "$totallikesinSingleVideo"
                        }
                    }
                }
            }
        ])

        // 2nd Approach

        // const channelTotalSubscribers = await Subscription.aggregate([
        //     {
        //         channel: new mongoose.Schema.Types.ObjectId(req.user?._id)
        //     },
        //     {
        //         $group: {
        //             _id: null,
        //             totalSubscribers: {
        //                 $sum: 1,
        //             }
        //         }
        //     },
        // ])

        // const totalVideosuploadByChannel = await Video.aggregate([
        //     {
        //         owner: new mongoose.Schema.Types.ObjectId(req.user?._id),
        //     },
        //     {
        //         $group: {
        //             _id: null,
        //             totalVideos: {
        //                 $sum: 1,
        //             }
        //         }
        //     }
        // ])
        // const totalviewsofChannel = await Video.aggregate([
        //     {
        //         owner: new mongoose.Schema.Types.ObjectId(req.user?._id),
        //     },
        //     {
        //         $group: {
        //             _id: null,
        //             totalVideos: {
        //                 $sum: "$views",
        //             }
        //         }
        //     }
        // ])

        // const channelTOTAL_Likes = await Video.aggregate([
        //     {
        //         owner: new mongoose.Schema.Types.ObjectId(req.user?._id)
        //     },
        //     {
        //         $lookup: {
        //             from: "likes",
        //             localField: "_id",
        //             foreignField: "video",
        //             as: "totalLikes",
        //         }
        //     },
        //     {
        //         $addFields: {
        //             totalLikes: {
        //                 $first: "$totalLikes"
        //             }
        //         }
        //     },
        //     {
        //         $group: {
        //             _id: null,
        //             channelTotalLikes: {
        //                 $sum: 1,
        //             }
        //         }
        //     }
        // ])




        return res
            .status(200)
            .json(
                new ApiResponse(200,
                    {
                        totalVideosViews: totalViews || 0,
                        TotalSubscribers: totalChannelSubscriber || 0,
                        TotalLikes: findtotalLikesinVideos[0].totalLikesofChannelVideos || 0,
                        gettotalvideos: totalvideos || 0,

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
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: owner,
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            avatar: 1,
                            fullName: 1,
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "Likes"
            }
        },
        {
            $addFields: {
                totalLikes: {
                    $size: "$Likes"
                }
            }
        },
        {
            $project: {
                videoFile: 1,
                thumbnail: 1,
                owner: 1,
                totalLikes: 1,
                createdAt: 1,
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