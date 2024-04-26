import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadonCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"

const generateAccessTokenandRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()
    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })
    return { accessToken, refreshToken }
  } catch (error) {
    throw new ApiError(500, "something went wrong while generating the access and refresh tokens")
  }
}

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend by postman or thunderClient
  // validate email,password,username,fullName, - not empty
  // check if user already exists : username or email
  // check avatar,coverImage is present
  // after images upload on Cloudinary
  // create User Object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return res

  const { email, username, fullName, password } = req.body;

  if ([email, username, fullName, password].some(ele => ele?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }]
  })

  if (existedUser) {
    throw new ApiError(409, "username or email already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path
  const coverImageLocalPath = req.files?.coverImage[0]?.path
  // console.log(req.files)
  
  if (!avatarLocalPath) {
    throw new ApiError(400, "avatar is required");
  }

  const avatar = await uploadonCloudinary(avatarLocalPath)
  const coverImage = await uploadonCloudinary(coverImageLocalPath)

  if (!avatar) {
    throw new ApiError(400, "avatar is required")
  }

  const createUser = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url,
    email: email,
    username,
    password

  })
  if (!createUser) {
    throw new ApiError(500, "Server Problem")
  }

  return res.status(201).json(
    new ApiResponse(200, createUser, "user registered successfully")
  )


});

const loginUser = asyncHandler(async (req, res) => {
  // req.body - data
  // check username email
  // find the user in database
  // if user is not present throw err
  // if user is true password check - true
  // then generate accessToken and refreshToken
  // send tokens through cookie
  // return res


  const { email, username, password } = req.body
  console.log(email, username)
  if (!username && !email) {
    throw new ApiError(400, "username and email are required");
  }

  const user = await User.findOne({
    $or: [{ username, email }]
  })
  if (!user) {
    throw new ApiError(404, "user not found")
  }
  const passwordValid = await user.isPasswordCorrect(password);
  if (!passwordValid) {
    throw new ApiError(404, "password is not valid")
  }

  const { accessToken, refreshToken } = await generateAccessTokenandRefreshToken(user._id);

  const loggedinUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )

  const options = {
    httpOnly: true,
    secure: true,
  }

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, { user: accessToken, loggedinUser, refreshToken }, "user loggedin Successfully")
    )




});


const logOutUser = asyncHandler(async (req, res) => {
  const userData = req.user;

  const user = await User.findByIdAndUpdate(
    userData._id,
    {
      $set: {
        refreshToken: undefined
      },

    },
    {
      new: true
    }

  )

  const options = {
    httpOnly: true,
    secure: true,
  }

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
      new ApiResponse(200, {}, "user logOut Successfully")
    )
})

const RefreshingrefreshToken = asyncHandler(async (req, res) => {
  try {
    const incomingrefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingrefreshToken) {
      throw new ApiError(401, "Unauthorized Access")
    }
    const decodedrefreshtokeninfo = jwt.verify(incomingrefreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decodedrefreshtokeninfo?._id)

    if (incomingrefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Invalid Refresh Token");
    }

    const { accessToken, refreshToken } = await generateAccessTokenandRefreshToken(user._id)

    const options = {
      httpOnly: true,
      secure: true,
    }

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(200, { accessToken, refreshToken }, "Access Token Refresh SuccessFully")
      )
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Refresh Token")
  }




})

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (confirmPassword !== newPassword) {
    throw new ApiError(401, "your password does not match in confirm field")
  }

  const user = await User.findById(req.user?._id);

  const checkoldPassword = await user.isPasswordCorrect(oldPassword)
  if (!checkoldPassword) {
    throw new ApiError(401, "your password is not correct")
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(new ApiResponse(200, {}, "password change successfully"))

})


const getCurrentUser = asyncHandler(async (req, res) => {
  return res
  .status(200)
  .json(
    new ApiResponse(200, req.user, "successfully get current User")
  )
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { username, fullName, email, } = req.body;
  if (!username || !fullName || !email) {
    throw new ApiError(401, "Invalid username");
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName,
        email,
        username,
      }
    },
    {
      new: true,
    }


  ).select("-password");


  return res.status(200).json(
    new ApiResponse(200, user, "your username changed successfully")
  )
})


const updateAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing")
  }

  const avatar = await uploadonCloudinary(avatarLocalPath);
  
  
  
  // todo - old image deleted
  if (!avatar.url) {
    throw new ApiError(400, "Error while uploading on avatar")
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url
      }
    },
    {
      new: true
    }
  ).select("-password");

  return res
    .status(200)
    .json(
      new ApiResponse(200, user, "avatar update successfully")
    )
})
const updateCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;
  if (!coverImageLocalPath) {
    throw new ApiError(400, "Avatar file is missing")
  }

  const coverImage = await uploadonCloudinary(avatarLocalPath)
  if (!coverImage.url) {
    throw new ApiError(400, "Error while uploading on coverImage")
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        coverImage: coverImage.url
      }
    },
    {
      new: true
    }
  ).select("-password");

  return res
    .status(200)
    .json(
      new ApiResponse(200, user, "coverImage update successfully")
    )
})

const getuserChannelProfile = asyncHandler(async (req, res) => {    

   const {username} = req.params;
   if(!username?.trim()){
    throw new ApiError(401,"username is missing");
   }

   const channel = await User.aggregate([
    {
     $match:{
      username:username?.toLowerCase(),
     }
    },
    {
      $lookup:{
        from:"subscriptions",
        localField:"_id",
        foreignField:"channel",
        as:"numberofSubcribers"
      }
    },
    {
      $lookup:{
        from:"subscriptions",
        localField:"_id",
        foreignField:"subscriber",
        as:"subcribedTo"
      }
    },
    {
      $addFields:{
        SubcribersCount:{
          $size:"$numberofSubcribers"
        },
        SubcribedTo:{
          $size:"$subcribedTo"
        },
        isSubscribed:{
          $cond:{
            if:{$in:[req.user?._id,"$numberofSubcribers.subscriber"]},
            then:true,
            else:false,
          }
        }
      }
    },
    {
      $project:{
        fullName: 1,
        username: 1,
        email:1,
        SubcribersCount:1,
        SubcribedTo:1,
        isSubscribed:1,
        avatar:1,
        coverImage:1,
        createAt:1,
      }
    }
   ])

   if(!channel?.length){
    throw new ApiError(404,"channel doesn't exist")
   }

   return res
   .status(200)
   .json(
    new ApiResponse(200,channel[0],"user channel fetched successfully")
   );

});

const getUserWatchHistory = asyncHandler(async(req,res)=>{
    const user = await User.aggregate([
      {
        $match:{
          _id:new mongoose.Schema.Types.ObjectId(req.user?._id)
        }
      },
      {
        $lookup:{
          from:"videos",
          localField:"watchHistory",
          foreignField:"_id",
          as:"watchHistory",
          pipeline:[
            {
              $lookup:{
                from:"videos",
                localField:"owner",
                foreignField:"_id",
                as:"owner",
                pipeline:[
                  {
                    $project:{
                      fullName:1,
                      username:1,
                      avatar:1,
                    }
                  },
                  {
                    $addFields:{
                      owner:{
                        first:"$owner",
                      }
                    }
                  }
                ]
              }
            }
          ]
        }
      }
     ]);

     

     

     return res
     .status(200)
     .json(
      new ApiResponse(200,user[0].watchHistory,"Watch history get successfully")
     )
})

export {
  registerUser,
  loginUser,
  logOutUser,
  RefreshingrefreshToken,
  getCurrentUser,
  updateAccountDetails,
  updateAvatar,
  updateCoverImage,
  changePassword,
  getuserChannelProfile,
  getUserWatchHistory
}




