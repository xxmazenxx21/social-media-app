import { S3Client} from "@aws-sdk/client-s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { StorageEnum } from "./cloud.multer";
import { v4 as uuid } from "uuid"
import { createReadStream } from "fs";
import { BadRequestException } from "../response/error.response";



export const s3config = ()=>{
    return new  S3Client({
        region:process.env.AWS_REGION as string,
        endpoint: `https://s3.${process.env.AWS_REGION}.wasabisys.com`,
        credentials:{
            accessKeyId:process.env.AWS_ACCESS_KEY_ID as string,
            secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY as string
        }
    })
}


export const uploadFile = async ({
    storageApproch = StorageEnum.MEMORY,
    Bucket = process.env.AWS_BUCKET_NAME as string,
    ACL = "private",
    path = "General",
    file,
  }: {
    storageApproch?: StorageEnum;
    Bucket?: string;
    ACL?: "private" | "public-read" ;
    path?: string;
    file: Express.Multer.File;
  }) => {
    const s3 = s3config();
  
    const command = new PutObjectCommand({
      Bucket,
      ACL,
      Key: `${process.env.APPLICATION_NAME}/${path}/${uuid()}-${file.originalname}`,
      Body: storageApproch == StorageEnum.MEMORY ? file.buffer : createReadStream(file.path),
      ContentType: file.mimetype,
    });
  
     await s3.send(command);
    if(!command?.input?.Key){
        throw new BadRequestException("file not uploaded")
    }
    return command.input.Key;
  };



  export const uploadFiles = async ({
    storageApproch = StorageEnum.MEMORY,
    Bucket = process.env.AWS_BUCKET_NAME as string,
    ACL = "private",
    path = "General",
    files,
  }: {
    storageApproch?: StorageEnum;
    Bucket?: string;
    ACL?: "private" | "public-read" ;
    path?: string;
    files: Express.Multer.File[];
  }):Promise<string[]> => {
    let urls:string[] =[];
  urls = await Promise.all(files.map(file=>uploadFile({file,Bucket,ACL,path})))
    return urls
  };