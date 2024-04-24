import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asynchandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { Playlist } from "../models/playlist.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.model.js";



const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    if (!name || !description) {
        throw new ApiError(401, "name and description are required")
    }
    const playlist = await Playlist.create({
        name,
        description,
        owner: req.user?._id
    });

    console.log(playlist)


    return res
        .status(200)
        .json(new ApiResponse(200, playlist, "playlist created successfully"));

    //Todo: create Playlist
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params
    if (!userId?.trim()) {
        throw new ApiError(401, "userId is not valid")
    }
    const isvaliduserId = isValidObjectId(userId)
    if (!isvaliduserId) {
        throw new ApiError(401, "userId is not valid")
    }
    

    const findUserPlaylist = await Playlist.find({ owner: userId }, { videos: 1, name: 1, description: 1, _id: 0 });


    return res
        .status(200)
        .json(
            new ApiResponse(200, findUserPlaylist, "User playlist fetchedSuccessFully")
        )




})

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    if (!playlistId?.trim()) {
        throw new ApiError(401, "userId is not valid")
    }
    const isvaliduserId = isValidObjectId(playlistId)
    if (!isvaliduserId) {
        throw new ApiError(401, "userId is not valid")
    }
   

    const findUserPlaylist = await Playlist.findOne({ _id: playlistId }, { videos: 1, name: 1, description: 1, _id: 0 });


    return res
        .status(200)
        .json(
            new ApiResponse(200, findUserPlaylist, "User playlist fetchedSuccessFully")
        )
})

const addVideoToPlayList = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params
    if (!playlistId || !videoId) {
        throw new ApiError(401, "playlist and vidoeId are required");
    }
    const isValidplayListId = isValidObjectId(playlistId)
    console.log(isValidplayListId)

    const isValidvideoId = isValidObjectId(videoId)
    console.log(isValidvideoId)

    if (!isValidplayListId) {
        throw new ApiError(401, "playList id is not valid")
    }
    if (!isValidvideoId) {
        throw new ApiError(401, "playList id is not valid")
    }

    const playlist = await Playlist.findById(playlistId)
    const video = await Video.findById(videoId);
    playlist.videos.push(video._id);
    await playlist.save({ validateBeforeSave: false })
    return res
        .status(200)
        .json(
            new ApiResponse(200, playlist, "add video successfully")
        )
})

const removeVideoFromPlayList = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params

    if (!playlistId || !videoId) {
        throw new ApiError(401, "playlist and vidoeId are required");
    }
    const isValidplayListId = isValidObjectId(playlistId)
    console.log(isValidplayListId)

    const isValidvideoId = isValidObjectId(videoId)
    console.log(isValidvideoId)

    if (!isValidplayListId) {
        throw new ApiError(401, "playList id is not valid")
    }
    if (!isValidvideoId) {
        throw new ApiError(401, "playList id is not valid")
    }

    
    const playlist = await Playlist.findById(playlistId);


    const videos = playlist.videos.filter(id => {
        return id.toString() !== videoId
    })

    playlist.videos = videos;
    await playlist.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(
            new ApiResponse(200, playlist, "successfully deleted video from playlist")
        )

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    if (!playlistId) {
        throw new ApiError(401, "playlistId is required")
    }
    const isValidplaylistID = isValidObjectId(playlistId)
    if (!isValidplaylistID) {
        throw new ApiError(401, "playList id is not valid ")
    }

    

    const playlist = await Playlist.deleteOne({ _id: playlistId })
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "successfully delete playlist"))
})


const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    const { name, description } = req.body

    if (!playlistId) {
        throw new ApiError(401, "playlistId is required")
    }
    const isValidplaylistID = isValidObjectId(playlistId)
    if (!isValidplaylistID) {
        throw new ApiError(401, "playList id is not valid ")
    }
    if (!name || !description) {
        throw new ApiError(401, "name and description are required")
    }

    

    const playlist =  await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set:{
            name,
            description,
            }

        },
        {
            new: true,
        }

    )
    return res
    .status(200)
    .json(
      new ApiResponse(200,playlist,"update playlist successfully")
    )
})


export {
    createPlaylist,
    getPlaylistById,
    getUserPlaylists,
    removeVideoFromPlayList,
    deletePlaylist,
    updatePlaylist,
    addVideoToPlayList,
}