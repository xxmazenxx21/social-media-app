import { DatabaseRepository } from "./database.repository"
import { Model } from "mongoose"; 
import { Ifriend } from "../Models/FriendRequest.model";


export class FriendRepository extends DatabaseRepository<Ifriend> {


    
    constructor( protected override readonly  model: Model<Ifriend>) {
        super(model);
    }

  




}