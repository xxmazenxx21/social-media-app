import type { NextFunction, Request, Response } from "express";
import { BadRequestException } from "../utils/response/error.response";
import { decodedToken, tokentypeEnum } from "../utils/token/token";
import { RoleEnum } from "../DB/Models/User.model";


    // interface IAuth extends Request {
    
    //     user: HUserDocument ;
    //     decoded: JwtPayload ;
    // }
export const authentication = (accessRole:RoleEnum[] = [] , tokentype:tokentypeEnum = tokentypeEnum.Access)=>{
return async(req:Request,res:Response,next:NextFunction)=>{
 
    if(!req.headers.authorization)
        throw new BadRequestException("authorization header is required")

const {decoded , user}  = await decodedToken({authorization:req.headers.authorization, tokentype})

if(!accessRole.includes(user.role))
throw new BadRequestException("unauthorized")
req.user =user ;
req.decoded = decoded ; 
next(); 

}
    

}
