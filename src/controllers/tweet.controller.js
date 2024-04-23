import mongoose,{isValidObjectId} from "mongoose";
import { asyncHandler } from "../utils/asynchandler";
import { User } from "../models/user.model";
import { Tweet } from "../models/tweet.model";



const createTweet = asyncHandler(async(req,res)=>{
  // create user Tweet
})

const getUserTweets = asyncHandler(async(req,res)=>{
  // get user all tweets
})
const updateTweet = asyncHandler(async(req,res)=>{
 //  update Tweet
})
const deleteTweet = asyncHandler(async(req,res)=>{
 // delete Tweet
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet,
}

