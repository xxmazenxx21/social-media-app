import { Request, Response } from "express";
import { IcreateGroupDto,  IgetchatDto, ISayhi, ISendmessage, IgetGroupChatDto, IJoinRoom, ISendGroupMessage } from "./chat.dto";
import { ChatRepository } from "../../DB/repositories/chat.repository";
import { ChatModel } from "../../DB/Models/chat.model";
import { UserRepository } from "../../DB/repositories/User.repository";
import { UserModel } from "../../DB/Models/User.model";
import { Types } from "mongoose";
import { NotFoundException } from "../../utils/response/error.response";
import {v4 as uuid} from 'uuid';
export class ChatService {
  private _chatmodel = new ChatRepository(ChatModel);
  private _usermodel = new UserRepository(UserModel);
  constructor() {}

  getchat = async (req: Request, res: Response): Promise<Response> => {
    const { userid } = req.params as IgetchatDto;
    const chat = await this._chatmodel.findone({
      filter: {
        participants: {
          $all: [
            req.user?._id as Types.ObjectId,
            Types.ObjectId.createFromHexString(userid),
          ],
        },
        group: { $exists: false },
      },
      options: { populate: "participants" },
    });
    if (!chat) throw new NotFoundException("chat not found");

 return res.status(200).json({
  message: "chat found",
  data: { chat }
});
  };


  createGroup = async (req: Request, res: Response): Promise<Response> => {
    const { participants,group } = req.body as  IcreateGroupDto;

const dbparticipants =  participants.map((id)=> {
    return Types.ObjectId.createFromHexString(id)}
);

const user = await this._usermodel.find({
    filter:{
    _id:{$in:dbparticipants},
    friends:{$in :[req.user?._id as Types.ObjectId]}
    }
})

if(user.length !== dbparticipants.length) throw new NotFoundException("one or more users not found or not your friend");
const roomid = uuid() ;
const [newChat] = await this._chatmodel.create({
    data:[{participants:[...dbparticipants,req.user?._id as Types.ObjectId],
        group,
        roomid,
        createdBy:req.user?._id as Types.ObjectId}]
})||[];
if(!newChat) throw new NotFoundException("chat not found");


return res.status(201).json({
    message:"group chat created",
    data:{chat:newChat}
})

  
  };


  getGroupChat = async (req: Request, res: Response): Promise<Response> => {
    const { groupid } = req.params as IgetGroupChatDto;
    const userId = req.user?._id as Types.ObjectId;

    const chat = await this._chatmodel.findone({
      filter: {
        _id: Types.ObjectId.createFromHexString(groupid),
        participants: { $in: [userId] },
        group: { $exists: true }
      },
      options: { populate: "message.createdBy" }
    });

    if (!chat) throw new NotFoundException("group chat not found or you are not a participant");

    return res.status(200).json({
      message: "group chat found",
      data: { chat }
    });
  };









  //io
  SayHi = ({ message, callback, socket ,io}: ISayhi) => {
    try {
      console.log(message);
      callback ? callback("i received your message") : undefined;
    } catch (error) {
      socket.emit("custom_error", error);
    }
  };

  SendMessage = async ({ content, sendTo, socket,io }: ISendmessage) => {
    try {
        console.log({content, sendTo});
      const createdBy = socket.Credentials?.user?._id as Types.ObjectId;
      const user = await this._usermodel.findone({
        filter: {
          _id: Types.ObjectId.createFromHexString(sendTo),
          friends: { $in: [createdBy] },
        },
      });
      if (!user)
        throw new NotFoundException("user not found or not your friend");
      const chat = await this._chatmodel.findOneAndUpdate({
        filter: {
          participants: {
            $all: [createdBy, Types.ObjectId.createFromHexString(sendTo)],
          },
          group: { $exists: false },
        },
        update: {
          $push: {
            message: {
              content,
              createdBy,
            },
          },
        },
      });

      if (!chat) {
        const [newchat] =
          (await this._chatmodel.create({
            data: [
              {
                createdBy,
                message: [
                  {
                    content,
                    createdBy,
                  },
                ],
                participants: [
                  createdBy,
                  Types.ObjectId.createFromHexString(sendTo),
                ],
              },
            ],
          })) || [];
        
          if(!newchat) throw new NotFoundException("chat not found");

      }
      io?.emit("successMessage",{content});
       io?.emit("newMessage",{content,from:socket.Credentials?.user?._id});
    } catch (error) {
      socket.emit("custom_error", error);
    }
  };

  JoinRoom = async ({ roomid, socket, io }: IJoinRoom) => {
    try {
   
      const userId = socket.Credentials?.user?._id as Types.ObjectId;
    
      
      const chat = await this._chatmodel.findone({
        filter: {
          roomid,
          participants: { $in: [userId] },
          group: { $exists: true }
        }
      });
      if (!chat) {
        throw new NotFoundException("room not found or you are not a participant");
      }

      socket.join(chat.roomid as string);
    
      socket.emit("joinRoom_success", { roomid: chat.roomid, message: "Joined room successfully" });
    } catch (error) {
  
      socket.emit("custom_error", error);
    }
  };

  SendGroupMessage = async ({ groupId, content, socket, io }: ISendGroupMessage) => {
    try {
     
      const createdBy = socket.Credentials?.user?._id as Types.ObjectId;

      const chat = await this._chatmodel.findOneAndUpdate({
        filter: {
          _id: Types.ObjectId.createFromHexString(groupId),
          participants: { $in: [createdBy] },
          group: { $exists: true }
        },
        update: {
          $push: {
            message: {
              content,
              createdBy,
            },
          },
        },
      });

      if (!chat) throw new NotFoundException("group not found or you are not a participant");

       io?.emit("successMessage",{content});
    } catch (error) {
      socket.emit("custom_error", error);
    }
  };
}

export default new ChatService();
