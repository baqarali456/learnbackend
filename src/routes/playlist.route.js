import { createPlaylist, getPlaylistById, getUserPlaylists } from "../controllers/playlist.controller.js";
import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.miidleware.js"

const router = Router()

router.use(verifyJWT);

router.route('/create-playlist').post(createPlaylist)
router.route('/getuser-playlist/:userId').get(getUserPlaylists);
router.route('/get-playlist/:playlistId').get(getPlaylistById);

export default router;