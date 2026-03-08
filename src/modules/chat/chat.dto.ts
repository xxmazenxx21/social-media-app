import { IAuthSocket } from "../Gateway/gateway.dto";
import z from "zod";
import { createGroupSchema, getchatSchema, getGroupChatSchema } from "./chat.validation";
import { Server } from "socket.io";
export interface ISayhi{
    message:string;
    socket:IAuthSocket;
    callback:any;
    io:Server;
}
export interface ISendmessage{
    content:string;
    sendTo:string;
    socket:IAuthSocket;
    io:Server;
  
}

export interface IJoinRoom{
    roomid:string;
    socket:IAuthSocket;
    io:Server;
}

export interface ISendGroupMessage{
    groupId:string;
    content:string;
    socket:IAuthSocket;
    io:Server;
}

export type IgetchatDto =z.infer<typeof getchatSchema.params> 
export type IcreateGroupDto =z.infer<typeof createGroupSchema.body>
export type IgetGroupChatDto =z.infer<typeof getGroupChatSchema.params> 