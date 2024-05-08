import {Router} from "express";
import { verifyJWT } from "../middlewares/auth.miidleware.js";
import { getLikedVideos, toggleCommentLike, toggleTweetLike, toggleVideoLike } from "../controllers/like.controller.js";

const router = Router()
router.use(verifyJWT);

router.route("/toggle/v/:videoId").post(toggleVideoLike)
router.route("/toggle/c/:commentId").post(toggleTweetLike)
router.route("/toggle/t/:tweetId").post(toggleCommentLike)
router.route("/videos").get(getLikedVideos)

export default router;