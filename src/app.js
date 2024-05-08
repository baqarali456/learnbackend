import express, { json } from "express"
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true,
}));

app.use(express.json({limit:"200kb"}));
app.use(express.urlencoded({ extended: true,limit:"16kb" })); 

app.use(express.static("public"));
app.use(cookieParser());

//routes import
import userRouter from './routes/user.route.js'
import videoRouter from './routes/video.route.js'
import playListRouter from './routes/playlist.route.js'
import commentRouter from './routes/comment.route.js';
import tweetRouter from './routes/tweet.route.js';
import likeRouter from './routes/like.route.js';
import dashboardRouter from './routes/dashboard.route.js';
import subscriptionRouter from './routes/Subscription.route.js';

//routes declaration
app.use('/api/v1/users',userRouter)
app.use('/api/v1/videos',videoRouter)
app.use('/api/v1/playlist',playListRouter)
app.use('/api/v1/comment',commentRouter)
app.use('/api/v1/tweet',tweetRouter)
app.use('/api/v1/like',likeRouter)
app.use('/api/v1/dashboard',dashboardRouter)
app.use('/api/v1/subscription',subscriptionRouter)



export {app};