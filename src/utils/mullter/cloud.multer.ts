import multer, { FileFilterCallback, Multer } from "multer";
import os from "os";
import { v4 as uuid } from "uuid";
import { BadRequestException } from "../response/error.response";
import type { Request } from "express";

export enum StorageEnum  {

DISK ="DISK" ,
MEMORY = "MEMORY"

}

export const fileValidation= {
image : ["image/jpeg","image/png","image/jpg"],
video : ["video/mp4","video/3gpp","video/quicktime"],

}




export const cloudUpload  = ({storageApproach = StorageEnum.DISK,validation=[],maxsize=5}:{storageApproach?:StorageEnum , validation?:string[],maxsize?:number}):Multer=>{




const storage = storageApproach == StorageEnum.MEMORY?  multer.memoryStorage() :multer.diskStorage({
    destination : os.tmpdir(),
    filename(req,file:Express.Multer.File,cb){
           cb(null,`${uuid()}-${file.originalname}`)
    }

     

   

   
})   

function fileFilter(req:Request,file:Express.Multer.File,cb: FileFilterCallback){
    if(!validation.includes(file.mimetype)){
        return cb(new BadRequestException("Invalid file type"))
    }
    cb(null,true)
}



return multer({

    fileFilter,
    limits:{
        fileSize:maxsize*1024*1024
    },
    storage
  
})



}