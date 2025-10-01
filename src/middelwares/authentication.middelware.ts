import type { NextFunction, Request, Response } from "express";
import { BadRequestException } from "../utils/response/error.response";
import { decodedToken } from "../utils/token/token";

import { HUserDocument } from "../DB/Models/User.model";
import { JwtPayload } from "jsonwebtoken";

interface IAuth extends Request {

    user : HUserDocument ;
    decoded : JwtPayload ;
}


export const authentication = ()=>{
return async(req:IAuth,res:Response,next:NextFunction)=>{
 
    if(!req.headers.authorization)
        throw new BadRequestException("authorization header is required")

const {decoded , user}  = await decodedToken({authorization:req.headers.authorization,})

req.user =user ;
req.decoded = decoded ; 
next(); 

}
    

}
