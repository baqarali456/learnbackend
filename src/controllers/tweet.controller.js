import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asynchandler.js";
import { User } from "../models/user.model.js";
import { Tweet } from "../models/tweet.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";



const createTweet = asyncHandler(async (req, res) => {
  // create user Tweet // owner
  const { content } = req.body;
  if (!content?.trim()) {
    throw new ApiError(401, "content is required")
  }
   const user = await User.findById(req.user?._id)
   if(!user){
    throw new ApiError(404,"user not found")
   }
  const tweet = await Tweet.create({
    content,
    owner: req.user?._id,
  })

  return res
    .status(200)
    .json(
      new ApiResponse(200, tweet, "Tweet is created successfully")
    )

})

const getUserTweets = asyncHandler(async (req, res) => {
  // get user all tweets
  const {userId} = req.params;
  if(!userId?.trim()){
    throw new ApiError(401,"userId is required")
  }
  const isValiduserId =  isValidObjectId(userId)
  if(!isValiduserId){
    throw new ApiError(404,"validuserId is not valid")
  }
  const alluserTweets = await User.aggregate([
   {
    $match:{
      _id: new mongoose.Schema.Types.ObjectId(userId),
    }
   },
   {
    $lookup:{
      from:"tweets",
      localField:"_id",
      foreignField:"owner",
      as:"UserTweets"
    }
   },
   {
    $addFields:{
      UserTweets:{
        $first:"$UserTweets"
      }
    }
   },
   {
    $project:{
      UserTweets:1,
    }
   }
  ])

  if(!alluserTweets?.length){
    throw new ApiError(404,"user Tweets does not exist")
  }

  return res
  .status(200)
  .json(
    new ApiResponse(200,alluserTweets,"successfully fetched user Tweets")
  )


})
const updateTweet = asyncHandler(async (req, res) => {
  //  update Tweet
  const { tweetId } = req.params;
  const { content } = req.body;
  if (!tweetId?.trim()) {
    throw new ApiError(401, "tweetId is required")
  }
  const isValidtweetId = isValidObjectId(tweetId)
  if (!isValidtweetId) {
    throw new ApiError(401, "tweetId is not valid")
  }

  if (!content?.trim()) {
    throw new ApiError(401, "content is required")
  }

  const updatedTweet = await Tweet.findByIdAndUpdate(
    tweetId,
    {
      $set: {
       content,
      }
    },
    {
      new:true
    }
  )


  return res
  .status(200)
  .json(
    new ApiResponse(200,updatedTweet,"tweet is successsfully updated")
  )

})

const deleteTweet = asyncHandler(async (req, res) => {
  // delete Tweet
  const { tweetId } = req.params;
  
  if (!tweetId?.trim()) {
    throw new ApiError(401, "tweetId is required")
  }
  const isValidtweetId = isValidObjectId(tweetId)
  if (!isValidtweetId) {
    throw new ApiError(401, "tweetId is not valid")
  }
  
  const deletedtweet = await Tweet.deleteOne({_id:tweetId})

  return res
  .status(200)
  .json(
    new ApiResponse(200,deletedtweet,"successfully delete tweet")
  )
})

export {
  createTweet,
  getUserTweets,
  updateTweet,
  deleteTweet,
}

