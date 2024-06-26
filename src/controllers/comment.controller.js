import mongoose,{isValidObjectId} from "mongoose";
import { asyncHandler } from "../utils/asynchandler.js";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.model.js";


const getVideoComments = asyncHandler(async(req,res)=>{
    const {videoId} = req.params
    const {page = 1, limit=10} = req.query;
    if(!videoId?.trim()){
        throw new ApiError(401,"videoId is required")
    }
    const isValidVideoId =  isValidObjectId(videoId)
    if(!isValidVideoId){
        throw new ApiError(401,"video Id is not valid")
    }

    const video = await Video.findById(videoId,{title:1})
     
    const commentaggregate = await Comment.aggregate([
        {
            $match:{
                video:new mongoose.Schema.Types.ObjectId(videoId)
            }
        },
    ]);

    const allcommentsonVideo = await  Comment.aggregatePaginate(
        commentaggregate,
        {
            page:Math.max(page,1),
            limit:Math.max(limit,1),
            customLabels:{
                totalDocs:"VideocommentsbyQuery",
                docs:"totalVideoComments"
            }
        }
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200,{allcommentsonVideo,videodetails:video},"get successfully comments on video")
    )
})

const addComment = asyncHandler(async(req,res)=>{
    // add a comment to video
    const {videoId} = req.params
    const {content} = req.body
    if(!videoId?.trim()){
        throw new ApiError(401,"videoId is required")
    }
    const isValidvideoId =  isValidObjectId(videoId)
    if(!isValidvideoId){
        throw new ApiError(401,"videoId is not valid")
    }
    if(!content?.trim()){
        throw new ApiError(404,"content is required")
    }
      const video = await Video.findById(videoId)

    const comment = await Comment.create({
        content,
        video:video?._id,
        owner:req.user?._id,
    });

    return res
    .status(200)
    .json(
        new ApiResponse(200,comment,"comment is created")
    )

})

const updateComment = asyncHandler(async(req,res)=>{
   // update a comment
   const {commentId} = req.params;
   const {content} = req.body;
   if(!content?.trim()){
    throw new ApiError(401,"content is required")
   }
   if(!commentId?.trim()){
    throw new ApiError(401,"commentID is required")
   }
    const isValidcommentId = isValidObjectId(commentId)
    if(!isValidcommentId){
        throw new ApiError(401,"comment Id is not Valid")
    }
    

    const comment = await Comment.findByIdAndUpdate(
        commentId,
        {
            $set:{
                content,
            }
        },
        {
            new:true,
        },
       
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200,comment,"successfully update comment")
    )

})

const deleteComment = asyncHandler(async(req,res)=>{
 // delete a comment
 const {commentId} = req.params;
   if(!commentId?.trim()){
    throw new ApiError(401,"commentID is required")
   }
    const isValidcommentId = isValidObjectId(commentId)
    if(!isValidcommentId){
        throw new ApiError(401,"comment Id is not Valid")
    }
    

    const comment = await Comment.deleteOne({_id:commentId})
    console.log(comment)
    
    

    return res
    .status(200)
    .json(
        new ApiResponse(200,comment,"successfully update comment")
    )
})


export{
    deleteComment,
    updateComment,
    addComment,
    getVideoComments,
}