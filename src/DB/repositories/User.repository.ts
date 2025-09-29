import { IUser } from "../../DB/Models/User.model";
import { DatabaseRepository } from "./database.repository"
import { Model } from "mongoose"; 
import { BadRequestException } from "../../utils/response/error.response";
import { HydratedDocument, CreateOptions } from "mongoose";


export class UserRepository extends DatabaseRepository<IUser> {
    constructor( protected override readonly  model: Model<IUser>) {
        super(model);
    }

  async createUser({
    data,
    options,
  }: {
    data: Partial<IUser>[];
    options?: CreateOptions;
  }): Promise<HydratedDocument<IUser>> {
    
       const [user] = await this.create({data,options,})  ||   []  ;

       if(!user){
         throw new BadRequestException("user signup failed");
       }
       return user;
  }





}