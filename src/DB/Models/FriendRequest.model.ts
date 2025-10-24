import mongoose, { HydratedDocument, model, models,Types} from "mongoose" 


export  interface Ifriend  {
createdby : Types.ObjectId ,
sendTo : Types.ObjectId
AcceptedAt ?: Date ,
createdAt? : Date;
updatedAt? : Date;

}


export const FriendSchema = new mongoose.Schema<Ifriend>({

 createdby : {type : mongoose.Schema.Types.ObjectId , required : true, ref:"User"},
 sendTo : {type : mongoose.Schema.Types.ObjectId , required : true, ref:"User"},
 AcceptedAt : Date



},{
    timestamps:true,
    
})



export const Friendmodel = models.Friend || model<Ifriend>("Friend",FriendSchema);


export type HFriendDocument = HydratedDocument<Ifriend> 
 