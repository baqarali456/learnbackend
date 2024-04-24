import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asynchandler";
import { User } from "../models/user.model";
import { Tweet } from "../models/tweet.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";



const createTweet = asyncHandler(async (req, res) => {
  // create user Tweet // owner
  const { content } = req.body;
  if (!content?.trim()) {
    throw new ApiError(401, "content is required")
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
  const alluserTweets = await User.aggregate([
   {
    $match:{
      _id: new mongoose.Schema.Types.ObjectId(req.user?._id),
    }
   },
   {
    $lookup:{
      from:"tweets",
      localField:"_id",
      foreignField:"owner",
      as:"UserComments"
    }
   },
   {
    $addFields:{
      UserComments:{
        $first:"$UserComments"
      }
    }
   },
   {
    $project:{
      UserComments:1,
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

