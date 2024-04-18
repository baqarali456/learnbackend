import mongoose from "mongoose"

import {DB_NAME} from "../constants.js";

import { app } from "../app.js";



const connectDB = async() =>{
  try {
    let connectionMongoDB =  await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log('MONGODB CONNECTED IN TRY BLOCK',connectionMongoDB.connection.host);
    app.on("error",(error)=>{
    console.log("ERROR IN TRY BLOCK",error)
    })
    

  } catch (error) {
    console.log("MONGO DB CONNECTION ERROR",error);
    process.exit(1)
  }
}

export default connectDB;



  
 
