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

//routes declaration
app.use('/api/v1/users',userRouter)
app.use('/api/v1/videos',videoRouter)
app.use('/api/v1/playlist',playListRouter)



export {app};