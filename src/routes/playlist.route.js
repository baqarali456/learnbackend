import { addVideoToPlayList, createPlaylist, deletePlaylist, getPlaylistById, getUserPlaylists, removeVideoFromPlayList, updatePlaylist } from "../controllers/playlist.controller.js";
import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.miidleware.js"

const router = Router()

router.use(verifyJWT);

router.route('/create-playlist').post(createPlaylist)
router.route('/getuser-playlist/:userId').get(getUserPlaylists);
router.route('/get-playlist/:playlistId').get(getPlaylistById);
router.route('/addvideoIn-playlist/:playlistId/:videoId').patch(addVideoToPlayList);
router.route('/deletevideoIn-playlist/:playlistId/:videoId')
.delete(removeVideoFromPlayList);
router.route('/update-playlist/:playlistId').patch(updatePlaylist)
router.route('/delete-playlist/:playlistId').delete(deletePlaylist)

export default router;