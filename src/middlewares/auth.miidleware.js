import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynchandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
      const token = req.cookies?.accessToken || req.header("Authorization").replace("Bearer ","")

     const decodeTokenInfo = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

     if(!decodeTokenInfo){
        throw new ApiError(401,"invalid Access Token");
     }

      const user = await User.findById(decodeTokenInfo?._id).select(
        "-password -refreshToken"
      )
      if(!user){
        throw new ApiError(401,"Invalid Access Token")
      }

      req.user = user

      next()
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid Access Token");
    }
})