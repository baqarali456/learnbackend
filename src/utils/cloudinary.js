import {v2 as cloudinary} from 'cloudinary';
import fs from "fs";
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_KEY, 
  api_secret: process.env.CLOUDINARY_SECRET
});

const uploadonCloudinary = async(localfilepath) =>{
  try {
    if(!localfilepath) return null;
    // upload the file on cloudinary
  const response = await  cloudinary.uploader.upload(localfilepath,{
        resource_type:"auto"
    })
    console.log("file is uploaded on cloudinary",response)
    fs.unlinkSync(localfilepath)
    return response;
  } catch (error) {
    fs.unlinkSync(localfilepath) // remove the locally saved temporary operation got failed
    return null;
  }
}
export {uploadonCloudinary};




