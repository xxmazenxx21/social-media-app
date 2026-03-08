import mongoose, { HydratedDocument, model, models, Types } from "mongoose" 





export type HChatDocument = HydratedDocument<IChat> 
 
export type HMessageDocument = HydratedDocument<IMessage> 
export  interface IMessage  {
   content:string;
       createdAt?:Date;
    createdBy:Types.ObjectId;
    updatedAt?:Date;


};


export  interface IChat  {
    //ovo
participants:Types.ObjectId[];
message:IMessage[];


    //ovm
group?:string; //ref to group model
group_images?:string[]; //array of group images
roomid?:string; //array of group names
    //comon
    createdAt?:Date;
    createdBy:Types.ObjectId;
    updatedAt?:Date;

};



export const messageSchema = new mongoose.Schema<IMessage>({
content : {type : String ,
    minLength:1,
    maxLength:5000,
    required:true
  },
createdBy : {type : mongoose.Schema.Types.ObjectId , ref:"User"},
  },
{timestamps:true});



export const chatSchema = new mongoose.Schema<IChat>({
participants : [{type : mongoose.Schema.Types.ObjectId , ref:"User"}],
message : [messageSchema],
group :String,
group_images : String,
roomid :{type : String ,
    required:function(){
        return this.roomid
    },
},
createdBy : {type : mongoose.Schema.Types.ObjectId , ref:"User"},
  },
{timestamps:true

});



export const ChatModel = models.Chat || model<IChat>("Chat",chatSchema);

