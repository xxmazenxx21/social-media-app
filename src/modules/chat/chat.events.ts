import { Server } from "socket.io";
import { IAuthSocket } from "../Gateway/gateway.dto";
import { ChatService } from "./chat.service";

export class ChatEvents {
    private _chatService: ChatService = new ChatService();
  sayHi = (socket: IAuthSocket,io:Server) => {
    return socket.on("sayHi", (message, callback) => {
      this._chatService.SayHi({message,callback,socket,io});
    });
  };
  sendMessage = (socket: IAuthSocket,io:Server) => {
    return socket.on("sendMessage", (data:{content:string;sendTo:string}) => {
      this._chatService.SendMessage({...data,socket,io});
    });
  };
  joinRoom = (socket: IAuthSocket,io:Server) => {
    return socket.on("join_room", (data:{roomid:string}) => {
      this._chatService.JoinRoom({...data,socket,io});
    });
  };
  sendGroupMessage = (socket: IAuthSocket,io:Server) => {
    return socket.on("sendGroupMessage", (data:{groupId:string;content:string}) => {
      this._chatService.SendGroupMessage({...data,socket,io});
    });
  };


}
