import { Router } from "express";
import {loginUser, registerUser,logOutUser} from "../controllers/user.controller.js";
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
router.route('/refresh-token').post(RefreshingrefreshToken)


export default router;