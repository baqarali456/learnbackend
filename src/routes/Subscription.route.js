import {Router} from "express";
import { verifyJWT } from "../middlewares/auth.miidleware.js";
import { getSubcribedChannels, getUserChannelSubscribers, toggleSubscription } from "../controllers/subscription.controller.js";


const router = Router();
router.use(verifyJWT);

router.route("/c/:channelId").get(getUserChannelSubscribers).post(toggleSubscription)

router.route("/u/:subscribedId").get(getSubcribedChannels)


export default router