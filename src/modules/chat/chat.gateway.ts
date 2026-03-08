import { Server } from "socket.io";
import { IAuthSocket } from "../Gateway/gateway.dto";
import { ChatEvents } from "./chat.events";


export class ChatGateway {
private _chatEvents:ChatEvents = new ChatEvents();

    constructor(){}

      register =(socket:IAuthSocket,io:Server)=>{
this._chatEvents.sayHi(socket,io);
this._chatEvents.sendMessage(socket,io);
this._chatEvents.joinRoom(socket,io);
this._chatEvents.sendGroupMessage(socket,io);
    }

    
      
}