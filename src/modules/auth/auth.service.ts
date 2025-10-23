import type { Request, Response, NextFunction } from "express";
import { ISignupDTO } from "./auth.dto";
import { UserModel } from "../../DB/Models/User.model";
import { ConfilectException, NotFoundException,BadRequestException } from "../../utils/response/error.response";
import { UserRepository } from "../../DB/repositories/User.repository";
import { compareHash } from "../../utils/security/hash";

import { generateotp } from "../../utils/generate.otp";
import { createLoginCredentials} from "../../utils/token/token"


class AuthenticationService {
  private _userModel = new UserRepository(UserModel);
  constructor() {}

  signup = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const { username, email, password }: ISignupDTO = req.body;
    // check if user exists
    const checkuser = await this._userModel.findone({
      filter: { email },
      select: "email",
      options: { lean: true },
    });

    if (checkuser) throw new ConfilectException("user already exists");

    const otp = generateotp();

    // create
    const user = await this._userModel.createUser({
      data: [
        {
          username,
          email,
          password,
          confirmEmailOTP: `${otp}`,
        },
      ],
      options: { validateBeforeSave: true },
    });

   

    return res.status(200).json({ message: "user signup succesfuly", user });
  };




  login = async(req: Request, res: Response): Promise<Response> => {

const {email,password} = req.body;

const user =  await this._userModel.findone({filter:{email}});
if(!user)
  throw new NotFoundException("user not found");
if(!compareHash(password,user.password))
  throw new BadRequestException("invalid password");

const Creadentials = await createLoginCredentials(user);

    return res.status(200).json({ message: "user login succesfuly",Creadentials });
  };




  
  confirmEmail = async (req: Request, res: Response): Promise<Response> => {
const {email,otp} = req.body;

const user = await this._userModel.findone({ filter:{email,confirmEmailOTP:{$exists:true},confirmAt:{$exists:false}}});

if(!user) throw new NotFoundException("user not found");

if( !compareHash(otp,user.confirmEmailOTP))
    throw new BadRequestException("invalid otp");

await this._userModel.updateOne({filter:{email},update:{$unset:{confirmEmailOTP:true},confirmAt:Date.now()}})



return res.status(200).json({ message: "user updated succesfuly" });
  };






}





export default new AuthenticationService();
