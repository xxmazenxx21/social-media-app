import { DatabaseRepository } from "./database.repository"
import { Model } from "mongoose"; 
import { IChat } from "../Models/chat.model";


export class ChatRepository extends DatabaseRepository<IChat> {


    
    constructor( protected override readonly  model: Model<IChat>) {
        super(model);
    }

  




}

