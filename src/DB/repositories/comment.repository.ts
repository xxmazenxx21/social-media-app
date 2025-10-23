import { DatabaseRepository } from "./database.repository"
import { Model } from "mongoose"; 

import { Icomment } from "../Models/comment.model";


export class CommentRepository extends DatabaseRepository<Icomment> {


    
    constructor( protected override readonly  model: Model<Icomment>) {
        super(model);
    }

  




}

