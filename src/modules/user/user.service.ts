import type { Request, Response, NextFunction } from "express";
import { logOutEnum, revokeToken } from "../../utils/token/token";
import type { ILogoutDTO } from "./user.dto";
import { TokenModel } from "../../DB/Models/token.model";
import { TokenRepository } from "../../DB/repositories/Token.repository";
import { UpdateQuery } from "mongoose";
import { IUser } from "../../DB/Models/User.model";
import { UserRepository } from "../../DB/repositories/User.repository";
import { UserModel } from "../../DB/Models/User.model";
import { createLoginCredentials } from "../../utils/token/token";
import { HUserDocument } from "../../DB/Models/User.model";
import { JwtPayload } from "jsonwebtoken";
class UserService {
  constructor() {}

  private _tokenmodel = new TokenRepository(TokenModel);
  private _usermodel = new UserRepository(UserModel);






  profile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    return res
      .status(200)
      .json({ message: "user profile", user: req.user, decoded: req.decoded });
  };







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








}




export default new UserService();
