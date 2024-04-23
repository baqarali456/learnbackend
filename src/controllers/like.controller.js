import { isValidObjectId } from "mongoose";
import mongoose from "mongoose";
import { asyncHandler } from "../utils/asynchandler";


const toggleVideoLike = asyncHandler(async(req,res)=>{
      const {videoId} = req.params
      // toggle like on video 
})

const toggleCommentLike = asyncHandler(async(req,res)=>{
      const {commentId} = req.params
      // toggle like on Comment
})

const toggleTweetLike = asyncHandler(async(req,res)=>{
      const {tweetId} = req.params
      // toggle like on Tweet
})


const getLikedVideos = asyncHandler(async(req,res)=>{
   // get all liked videos
})


export {
    getLikedVideos,
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike
}