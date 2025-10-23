import mongoose, { HydratedDocument, model, models, Types } from "mongoose" 

export enum AllowCommnetsEnum  {
    ALLOW = "ALLOW",
    DENY = "DENY"
}


export enum AvilbiltyEnum  {
PUBLIC = "PUBLIC",
    FRIENDS = "FRIENDS",
    ONLYME ="ONLYME"
}

export enum ActionEnum  {
LIKE = "LIKE",
UNLIKE ="UNLIKE",

}





export  interface IPost  {
content?: string;
assetsPostsFolderid?:string;
attachments?:string[];
allowComments?: AllowCommnetsEnum;
Avilabilty?: AvilbiltyEnum;
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

export type HPostDocument = HydratedDocument<IPost> 
 


export const postSchema = new mongoose.Schema<IPost>({
  content : {type : String , 
    minLength:2,
    maxLength:5000,
    required: function(){
        return !this.attachments?.length
    }
  },

  attachments : [String],
  assetsPostsFolderid : String ,
  allowComments : {type : String , enum : Object.values(AllowCommnetsEnum) , default:AllowCommnetsEnum.ALLOW},
  Avilabilty : {type : String , enum : Object.values(AvilbiltyEnum) , default:AvilbiltyEnum.PUBLIC},
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


postSchema.pre(['findOne','find','findOneAndUpdate'], function(next){
const query = this.getQuery();

if(query.paranoid===false){
this.setQuery({...query})

}else{

    this.setQuery({...query,FreezedAt:{$exists:false}})
}


next();
})



export const PostModel = models.Post || model<IPost>("Post",postSchema);

