import mongoose, { HydratedDocument, model, models, Types } from "mongoose" 






export  interface IToken  {
jti : string 
, expiresIn  : number ,

userId : Types.ObjectId

}


export const tokenSchema = new mongoose.Schema<IToken>({
  jti : {type : String , required : true, unique:true},
  expiresIn  : {type : Number , required : true},
  userId : {type : mongoose.Schema.Types.ObjectId , ref:"User"}
  
},{
    timestamps:true,
   
})




export const TokenModel = models.Token || model<IToken>("Token",tokenSchema);


export type HTokenDocument = HydratedDocument<IToken> 
 