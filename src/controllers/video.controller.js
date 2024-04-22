import { Video } from "../models/video.model.js";
import { uploadonCloudinary } from "../utils/cloudinary.js";
import mongoose,{isValidObjectId} from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { User } from "../models/user.model.js";

const getAllVideos = asyncHandler(async(req,res)=>{
    const {page = 1,limit=20,query,sortBy,sortType,userId} = req.query;
})

const publishAVideo = asyncHandler(async(req,res)=>{
    //todo:get video,upload to cloudinary,create video
    //1- check for title and description is empty or not
    //2- User login h tabhi upload krna h
    //3- 
    const {title,description} = req.body;
    if(!title || !description){ 
        throw new ApiError(401,"title and description are required")
    }
    
    const user = await User.findById(req.user?._id)
    if(!user){
        throw new ApiError(401,"user is not present for publishVideo")
    }
    const videoLocalPath = req.files?.videoFile[0]?.path
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path
    
    

    const videoFile = await uploadonCloudinary(videoLocalPath)
    const thumbnail = await uploadonCloudinary(thumbnailLocalPath)

    if(!videoFile || !thumbnail ){
        throw new ApiError(401,"videoFile & thumbnail are required")
    }
    const video = await Video.create({
      videoFile:videoFile.url,
      thumbnail:thumbnail.url,
      title,
      description,
      duration:videoFile?.duration,
      
    })

    if(!video){
        throw new ApiError(500,"Server Problem")
    }
    
    return res
    .status(200)
    .json(new ApiResponse(200,video,"video generated successfully"));

})

const getVideoById = asyncHandler(async(req,res)=>{
    const {videoId} = req.params
    if(!videoId?.trim()){
        throw new ApiError(401,"videoId is required")
    }


    //Todo:get video By ID
     const video = await Video.findById(videoId);
     if(!video){
        throw new ApiError(401,"video Id is not Valid")
     }
    return res
    .status(200)
    .json(
        new ApiResponse(200,video,"video get successfully by id")
    )
})
const updateVideo = asyncHandler(async(req,res)=>{
    const {videoId} = req.params;

    

    const user = await User.findById(req.user?._id)
    if(!user){
        throw new ApiError(401,"Please login for upload and update video")
    }

    if(!videoId?.trim()){
        throw new ApiError(401,"videoId is required")
    }
    const checkVideoId = await Video.findById(videoId)
    console.log(checkVideoId)
    
    if(!checkVideoId){
        throw new ApiError(401,"video Id is not valid")
    }

    const originalVideoId = mongoose.Types.ObjectId.isValid(videoId)
    if(!originalVideoId){
        throw new ApiError(401,"videoId is not valid")
    }
    //Todo:update Video details like title,description,thumbnail;
    const {title,description} = req.body;
    
    

    if(!title && !description){
      throw new ApiError(401,"title and description are required");
    }

    const thumbnailPath = req.file?.path;
    if(!thumbnailPath){
        throw new ApiError(401,"thumbnail is required")
    }
    const thumbnail = await uploadonCloudinary(thumbnailPath)
    if(!thumbnail?.url){
        throw new ApiError(500,"server Problem")
    }

   const video = await Video.findByIdAndUpdate(
     videoId, 
     {
        $set:{
            title,
            description,
            thumbnail:thumbnail.url,
        }
     },
     {
        new :true
     } 
    )
    if(!videoId){
        throw new ApiError(500,"server Problem")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,video,"video update succeesfully by id")
    )
})
const deleteVideo = asyncHandler(async(req,res)=>{
    const {videoId} = req.params;
    if(!videoId?.trim()){
        throw new ApiError(401,"videoId is required")
    }
    
     const originalVideoId = mongoose.Types.ObjectId.isValid(videoId)
    if(!originalVideoId){
        throw new ApiError(401,"videoId is not valid")
    }

    const user = await User.findById(req.user?._id);
    if(!user){
        throw new ApiError(401,"please login for delete videos")
    }

    const checkVideoId = await Video.findById(videoId)
    console.log(checkVideoId)
    
    if(!checkVideoId){
        throw new ApiError(401,"video Id is not valid")
    }

   const findvideoforDelete = await Video.deleteOne({_id:videoId})
   console.log(findvideoforDelete);
   
    return res
    .status(200)
    .json(
        new ApiResponse(200,findvideoforDelete,"successfully deleted videos")
    );
})

const togglePublishStatus = asyncHandler(async(req,res)=>{
    const {videoId} = req.params;
    const user = await User.findById(req.user?._id);
    if(!user){
        throw new ApiError(401,"Please Login for togglePublishStatus");
    }
    if(!videoId?.trim()){
        throw new ApiError(401,"videoId is required")
    }
     const video = await Video.findById(videoId);
     if(!video){
        throw new ApiError(401,"video Id is not Valid")
     }
         
     const findIsPublished = await Video.findOne({_id:videoId});
     findIsPublished.isPublished = !findIsPublished.isPublished?true:false;
     
     await findIsPublished.save({validateBeforeSave:false})

      
      
      return res
      .status(200)
      .json(
        new ApiResponse(200,findIsPublished,"togglestatus for video completely")
      )
})

export{
    getAllVideos,
    getVideoById,
    togglePublishStatus,
    deleteVideo,
    updateVideo,
    publishAVideo,
}
