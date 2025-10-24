import type { Request, Response, NextFunction } from "express";
import { logOutEnum, revokeToken } from "../../utils/token/token";
import type { ILogoutDTO } from "./user.dto";
import { Types, UpdateQuery } from "mongoose";
import { IUser } from "../../DB/Models/User.model";
import { UserRepository } from "../../DB/repositories/User.repository";
import { UserModel } from "../../DB/Models/User.model";
import { createLoginCredentials } from "../../utils/token/token";
import { HUserDocument } from "../../DB/Models/User.model";
import { JwtPayload } from "jsonwebtoken";
import { PreSignedUrl, uploadFiles } from "../../utils/mullter/s3.config";
import { FriendRepository } from "../../DB/repositories/friend.repository";
import { Friendmodel } from "../../DB/Models/FriendRequest.model";
import { BadRequestException, ConfilectException, NotFoundException } from "../../utils/response/error.response";
class UserService {
  constructor() {}

  
  private _usermodel = new UserRepository(UserModel);

private _Freindmodel = new FriendRepository(Friendmodel);




  profile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    return res
      .status(200)
      .json({ message: "user profile", user: req.user, decoded: req.decoded });
  };

// sign up  /patrent  
// -sign up child
//  login 
// resetpassword 
// forgetpassword 
// confirm email





  logOut = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const { flag }: ILogoutDTO = req.body;
    const update: UpdateQuery<IUser> = {};
    let statuscode = 200;
    switch (flag) {
      case logOutEnum.Only:
        changeCredentilesTime: new Date();

        break;

      case logOutEnum.All:
      await revokeToken(req.decoded as JwtPayload);


        statuscode = 201

        break;
      default:
        break;
    }
    await this._usermodel.updateOne({
      filter: { _id: req.decoded?._id },
      update,
    });

    return res.status(statuscode).json({ message: "done" });
  };







  RefreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {


    const Credentials = await createLoginCredentials(req.user as HUserDocument);

    await revokeToken(req.decoded as JwtPayload);

    return res
      .status(201)
      .json({ message: "new credentials",data:Credentials  });
  };




  
  profileImage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {

    // const key = await uploadFile({file:req.file as Express.Multer.File , path:`user/${req.decoded?._id}`})

    const {originalname , ContentType} :{originalname : string , ContentType : string}= req.body ; 
    const {url,key}= await PreSignedUrl({originalname , ContentType,path:`user/${req.decoded?._id}`})
    return res
      .status(200)
      .json({ message: "profile image updated  successfully",url,key });
  };




  
  coverimagesUpload = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {

   const keys = await uploadFiles({files:req.files as Express.Multer.File[] , path:`user/${req.decoded?._id}`})
    return res
      .status(200)
      .json({ message: "profile image updated", keys });
  };









  
  sendFriendRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {

const {userid} = req.params as unknown as {userid:Types.ObjectId} ;

const chechFriendRequest = await this._Freindmodel.findone({
  filter:{
    createdby:{$in:[req.user?.id,userid]},
    sendTo: {$in :[req.user?.id,userid]}
  }
})

if(chechFriendRequest)  throw new ConfilectException("You have already sent this request");


const user = await this._usermodel.findone({filter:{_id:userid}})

if(!user) throw new NotFoundException("user not found ");

const [friend] = await this._Freindmodel.create({data:[{createdby:req.user?.id as Types.ObjectId,sendTo:userid}]})||[]
if(!friend) throw new ConfilectException("something went wrong");



    return res
      .status(201)
      .json({ message: "request sent successfully"  });
  };


  

  
  AcceptFriendRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {

const {requestid} = req.params as unknown as {requestid:Types.ObjectId} ;

const checkFriendRequest = await this._Freindmodel.findOneAndUpdate({
  filter:{
  _id:requestid ,
  createdby:req.user?.id
  },
  update:{
      AcceptedAt:new Date()
 
  }

})

if(!checkFriendRequest)  throw new BadRequestException("request not found");


await Promise.all([
  await this._usermodel.updateOne({
    filter:{
      _id:checkFriendRequest.createdby
    },
    update:{
      $addToSet:{friends:checkFriendRequest.sendTo}
    }

  }),
   await this._usermodel.updateOne({
    filter:{
      _id:checkFriendRequest.sendTo
    },
    update:{
      $addToSet:{friends:checkFriendRequest.createdby}
    }

  })
])


    return res
      .status(201)
      .json({ message: "accepted successfully"  });
  };










}




export default new UserService();
