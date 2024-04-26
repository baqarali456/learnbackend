import { isValidObjectId } from "mongoose";
import mongoose from "mongoose";
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import Like from "../models/likes.model.js";
import { Video } from "../models/video.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Comment } from "../models/comment.model.js";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  // toggle like on video
  if (!videoId?.trim()) {
    throw new ApiError(401, "videoId is required");
  }
  const isValidvideoId = isValidObjectId(videoId);
  if (!isValidvideoId) {
    throw new ApiError(404, "videoId is not valid");
  }

  const VideoLikestoggle = await Video.aggregate([
    {
      $match: {
        _id: new mongoose.Schema.Types.ObjectId(videoId),
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "LikedVideos",
      },
    },
    {
      $addFields: {
        isLikeVideo: {
          $cond: {
            if: { $in: [req.user?._id, "$LikedVideos.likedBy"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        isLikeVideo: 1,
        videoFile: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, VideoLikestoggle[0].isLikeVideo, "fetch videoLike Toggle"));
});


const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  // toggle like on Comment
  if (!commentId?.trim()) {
    throw new ApiError(401, "commentId is required");
  }
  const isValidcommentId = isValidObjectId(commentId);
  if (!isValidcommentId) {
    throw new ApiError(404, "commentId is not valid");
  }

  const CommentLikestoggle = await Comment.aggregate([
    {
      $match: {
        _id: new mongoose.Schema.Types.ObjectId(commentId),
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "comment",
        as: "LikedComments",
      },
    },
    {
      $addFields: {
        isLikeComment: {
          $cond: {
            if: { $in: [req.user?._id, "$LikedComments.likedBy"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        isLikeComment: 1,
        content: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, CommentLikestoggle
      , "fetch videoLike Toggle"));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  // toggle like on Tweet
  if (!tweetId?.trim()) {
    throw new ApiError(401, "tweetId is required");
  }
  const isValidtweetId = isValidObjectId(tweetId);
  if (!isValidtweetId) {
    throw new ApiError(404, "tweetId is not valid");
  }

  const toggleTweetLike = await Tweet.aggregate([
    {
      $match: {
        _id: new mongoose.Schema.Types.ObjectId(tweetId),
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "tweet",
        as: "LikedTweets",
      },
    },
    {
      $addFields: {
        isLikeTweet: {
          $cond: {
            if: { $in: [req.user?._id, "$LikedTweets.likedBy"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        isLikeTweet: 1,
        content: 1,
      },
    },
  ])

  return res
    .status(200)
    .json(new ApiResponse(200, toggleTweetLike, "fetch videoLike Toggle"));
});

const getLikedVideos = asyncHandler(async (req, res) => {
  // get all liked videos
  try {
    const LikedVideos = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Schema.Types.ObjectId(req.user._id),
        },
      },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "likedBy",
          as: "getLikedVideos",
          pipeline:[
            {
              $lookup:{
                from:"videos",
                localField:"video",
                foreignField:"_id",
                as:"video",
                pipeline:[
                  {
                    $project:{
                      title:1,
                      description:1,
                      videoFile:1,
                      thumbnail:1,
                    }
                  }
                ]
              }
            },
            {
              $addFields:{
                video:{
                  $first:"$video"
                }
              }
            }
            
          ]
        },
      },
      {
        $addFields:{
          getLikedVideos:{
            $first:"$getLikedVideos"
          }
        }
      },
      {
        $project:{
          video:1,
        }
      }
    ]);
    return res
      .status(200)
      .json(new ApiResponse(200, LikedVideos, "get Liked Videos successfully"));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, null, error.message));
  }
});

export { getLikedVideos, toggleCommentLike, toggleTweetLike, toggleVideoLike };
