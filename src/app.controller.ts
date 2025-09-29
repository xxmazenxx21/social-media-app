import express from 'express';
import path from 'node:path';
import type {  Express ,  Request , Response  } from 'express';
import {config} from 'dotenv';
import cors from 'cors'
import helmet from 'helmet';
import rateLimit  ,  {RateLimitRequestHandler}from 'express-rate-limit';
import authRouter from './modules/auth/auth.controller';
import { ErrorHandler } from './utils/response/error.response';
import connectDB from './DB/connection';
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


app.get('/users',(req:Request,res:Response)=>{
    res.status(200).json({message:'hello from ts'})
})

app.use('/api/auth',authRouter);



app.use(ErrorHandler);


app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})
}