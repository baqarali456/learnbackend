import mongoose from "mongoose";
import {DB_NAME} from '../constants.js'

import express from "express";
const app = express();

app.listen(process.env.PORT,()=>{
    console.log(`server running on Port ${process.env.PORT}`);
    
})

const connectDB = async() =>{
  try {
   const connectioninstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
   console.log(`MONGODB CONNECTED || DB HOST`, connectioninstance.connection.host);
   app.on("error",(error)=>{
   console.log(`error ${error} in Mongodb Connection try block`)
   })
  } catch (error) {
    console.log("MONGODB CONNECTION ERROR",error)
    process.exit(1);
  }
}

export default connectDB