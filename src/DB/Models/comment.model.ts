import mongoose, { HydratedDocument, model, models, Types } from "mongoose" 







export  interface Icomment  {
content?: string;

attachments?:string[];
postid:Types.ObjectId;
commentid?:Types.ObjectId;
tags?:Types.ObjectId[];
likes?:Types.ObjectId[];
Createdby:Types.ObjectId;
Freezedby?:Types.ObjectId; 
FreezedAt?:Date;
restoredBy?:Types.ObjectId;
restoredAt?:Date;
creaedat:Date;
updatedat?:Date;
}

export type HCommentDocument = HydratedDocument<Icomment> 
 


export const commentSchema = new mongoose.Schema<Icomment>({
  content : {type : String , 
    minLength:2,
    maxLength:5000,
    required: function(){
        return !this.attachments?.length
    }
  },
postid : {type : mongoose.Schema.Types.ObjectId , ref:"Post"},
commentid : {type : mongoose.Schema.Types.ObjectId , ref:"User"},
  attachments : [String],

  tags : [{type : mongoose.Schema.Types.ObjectId , ref:"User"}],
  likes : [{type : mongoose.Schema.Types.ObjectId , ref:"User"}],
  Createdby : {type : mongoose.Schema.Types.ObjectId , required : true, ref:"User"},
  Freezedby : {type : mongoose.Schema.Types.ObjectId , ref:"User"},
  FreezedAt : Date ,
  restoredBy : {type : mongoose.Schema.Types.ObjectId , ref:"User"},
  restoredAt : Date

  },
  
  {
    timestamps:true,
   
})




export const CommentModel = models.Post || model<Icomment>("Comment",commentSchema);

