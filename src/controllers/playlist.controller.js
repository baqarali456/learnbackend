import mongoose,{isValidObjectId} from "mongoose";
import { asyncHandler } from "../utils/asynchandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { Playlist } from "../models/playlist.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";



const createPlaylist = asyncHandler(async(req,res)=>{
    const {name,description} = req.body;
    
    const user = await User.findById(req.user?._id)
    if(!user){
        throw new ApiError(401,"please login for create Playlist")
    }
    if(!name || !description){
        throw new ApiError(401,"name and description are required")
    }
    const playlist = await Playlist.create({
      name,
      description,
      owner:req.user?._id
    });

    console.log(playlist)
    
    
     return res
     .status(200)
     .json(new ApiResponse(200,playlist,"playlist created successfully"));

    //Todo: create Playlist
})

const getUserPlaylists = asyncHandler(async(req,res)=>{
    const {userId} = req.params
    if(!userId?.trim()){
        throw new ApiError(401,"userId is not valid")
    }
    const isvaliduserId = isValidObjectId(userId)
    if(!isvaliduserId){
     throw new ApiError(401,"userId is not valid")
    }
    const user = await User.findById(req.user?._id);
    if(!user){
        throw new ApiError(401,"please login for get playlist")
    }

    const findUserPlaylist = await Playlist.find({owner:userId},{videos:1,name:1,description:1,_id:0});


    return res
    .status(200)
    .json(
        new ApiResponse(200,findUserPlaylist,"User playlist fetchedSuccessFully")
    )




})

const getPlaylistById = asyncHandler(async(req,res)=>{
    const {playlistId} = req.params
    if(!playlistId?.trim()){
        throw new ApiError(401,"userId is not valid")
    }
    const isvaliduserId = isValidObjectId(playlistId)
    if(!isvaliduserId){
     throw new ApiError(401,"userId is not valid")
    }
    const user = await User.findById(req.user?._id);
    if(!user){
        throw new ApiError(401,"please login for get playlist")
    }

    const findUserPlaylist = await Playlist.findOne({_id:playlistId},{videos:1,name:1,description:1,_id:0});


    return res
    .status(200)
    .json(
        new ApiResponse(200,findUserPlaylist,"User playlist fetchedSuccessFully")
    )
})

const addVideoToPlayList = asyncHandler(async(req,res)=>{
    const {playlistId,videoId} = req.params

})

const removeVideoFromPlayList = asyncHandler(async(req,res)=>{
    const {playlistId,videoId} = req.params

})

const deletePlaylist = asyncHandler(async(req,res)=>{
    const {playlistId} = req.params;

})


const updatePlaylist = asyncHandler(async(req,res)=>{
    const {playlistId} = req.params
    const {name,description} = req.body
})


export{
    createPlaylist,
    getPlaylistById,
    getUserPlaylists,
    removeVideoFromPlayList,
    deletePlaylist,
    updatePlaylist,
    addVideoToPlayList,
}