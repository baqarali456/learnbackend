import mongoose from "mongoose";
import dotenv from "dotenv"
import connectDB from "./db/db.js";
import { app } from "./app.js";


dotenv.config({
    path:'./.env'
})




connectDB()
.then(()=>{
  app.listen(process.env.PORT || 4000,()=>{
    console.log(`Server listening on Port ${process.env.PORT}`);
  })
  app.on("error",(error)=>{
    console.log(`ERROR IN  server ${error}`);
    
  })
})
.catch((err)=>{
    console.log("MONGO db connection failed !!!",err)
})



























// import express from "express"
// const app = express()

// (async()=>{
//     try {
//        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`) 
//         app.on("error",(err)=>{
//             console.log("error in try block",err)
//         })
//         app.listen(process.env.PORT,()=>{
//             console.log(`listening on PORT ${process.env.PORT}`)
//         })
//     } catch (error) {
//         console.log(`error ${error}`)
//         throw error
//     }
// })()