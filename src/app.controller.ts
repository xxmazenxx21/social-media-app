import express from 'express';
import path from 'node:path';
import type {  Express ,  Request , Response  } from 'express';
import {config} from 'dotenv';
import cors from 'cors'
import helmet from 'helmet';
import rateLimit  ,  {RateLimitRequestHandler}from 'express-rate-limit';
import authRouter from './modules/auth/auth.controller';        
import userRouter from './modules/user/user.controller';
import { BadRequestException, ErrorHandler } from './utils/response/error.response';
import connectDB from './DB/connection';
import { deleteFile, getFile, PreSignedUrlGet } from './utils/mullter/s3.config';
import { promisify } from 'node:util';
import { pipeline } from 'node:stream';
const S3createReadeStream  = promisify(pipeline);
config({path:path.resolve('./config/.env.dev')});

const limiter : RateLimitRequestHandler = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit:100,
    message:{
        status:429,
        message:'Too many requests from this IP, please try again '
    }
})



export const bootstrap = async():Promise<void>=>{
const app:Express = express();
const port :Number = Number(process.env.PORT) || 5000
app.use(cors(),helmet(),express.json());
app.use(limiter);


await connectDB();





app.get('/upload/preSignedUrl/*path',async(req:Request,res:Response)=>{
    const {downloadname,download} = req.query as {downloadname?:string,download?:string};
const {path}= req.params as unknown as {path:string[]} ;
// social-media-app/user/68da7c83f9b2092208f84250/59148842-9759-4ee5-bd54-4bf0a5ac8b17-PresignedURlbleach.jpg
const Key =path.join("/") ;

const url = await PreSignedUrlGet({Key, downloadName:downloadname as string , download : download as string})


return res.status(200).json({message:"done",url})

 })

app.get('/upload/*path',async(req:Request,res:Response)=>{
    const {downloadname} = req.query ;
const {path}= req.params as unknown as {path:string[]} ;
console.log(path);
// social-media-app/user/68da7c83f9b2092208f84250/59148842-9759-4ee5-bd54-4bf0a5ac8b17-PresignedURlbleach.jpg
const Key =path.join("/") ;
const s3Response = await getFile({Key})

res.setHeader('content-type',`${s3Response.ContentType}`||"application/octet-stream")

if(!s3Response?.Body){
    throw new BadRequestException("failed to get assets")
}

if(downloadname){
    res.setHeader('content-disposition',`attachment; filename="${downloadname}"`)
}

return await S3createReadeStream(s3Response.Body as NodeJS.ReadableStream ,res)

 })

 


 
app.get('/delete-file',async(req:Request,res:Response)=>{

    const {Key} = req.query as {Key:string} 
    const result = await deleteFile({Key})
    return res.status(200).json({message:"done",result})


 })



app.use('/api/auth',authRouter);
app.use('/api/user',userRouter);



app.use(ErrorHandler);


app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})
}