import { Router } from "express";
import {loginUser, registerUser,logOutUser, getCurrentUser,updateAccountDetails, changePassword, updateAvatar, updateCoverImage, getuserChannelProfile,  getUserWatchHistory} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js"; 
import { verifyJWT } from "../middlewares/auth.miidleware.js";
import { RefreshingrefreshToken } from "../controllers/user.controller.js";

const router = Router()

router.route('/register').post(
    upload.fields([
      {
       name:'avatar',
       maxCount:1,
      },
      {
         name:'coverImage',
         maxCount:1,
      }
    ]) 
   ,registerUser)

router.route('/login').post(loginUser)
router.route('/logout').post(verifyJWT,logOutUser)
router.route('/refresh-token').post(RefreshingrefreshToken);
router.route('/current-user').get(verifyJWT,getCurrentUser);
router.route('/change-password').post(verifyJWT,changePassword);
router.route('/update-account').patch(verifyJWT,updateAccountDetails)
router.route('/avatar').patch(verifyJWT,upload.single("avatar"),updateAvatar)
router.route('/coverImage').patch(verifyJWT,upload.single("coverImage"),updateCoverImage);
router.route('/c/:username').get(verifyJWT,getuserChannelProfile);
router.route('/watchHistory').get(verifyJWT,getUserWatchHistory);




export default router;