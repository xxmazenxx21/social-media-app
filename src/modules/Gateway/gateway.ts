import { Server as httpServer } from "node:http";
import { decodedToken, tokentypeEnum } from "../../utils/token/token";
import { IAuthSocket } from "./gateway.dto";
import { Server } from "socket.io";
import { ChatGateway } from "../chat/chat.gateway";



let io:Server|null = null;

export const intilize = (httpServer:httpServer)=>{




const connectedSockets = new Map<string, string[]>();

 io = new Server(httpServer,{
    cors:{
        origin:"*"
    }
});


// Middleware to authenticate and manage connected sockets
io.use(async(socket:IAuthSocket,next)=>{
    
try {
   const {user,decoded} = await decodedToken({authorization:socket.handshake?.auth.authorization||"",tokentype:tokentypeEnum.Access})

  const tabs = connectedSockets.get(user._id.toString()) || [];
  tabs.push(socket.id);
   connectedSockets.set(user._id.toString(),tabs);
   socket.Credentials = {user,decoded};
   next();
} catch (error) {
    next(new Error("Unauthorized"))
}

})






function discconection (socket:IAuthSocket){
    socket.on("disconnect",()=>{
    const userId = socket.Credentials?.user._id?.toString();
    let remaningTabs = connectedSockets.get(userId as string || "")?.filter((tab)=> tab !==socket.id)||[];
    if(remaningTabs.length){
    connectedSockets.set(userId as string,remaningTabs)
    }else{
        connectedSockets.delete(userId as string)
    }
console.log(`logged out from ${connectedSockets.get(userId as string ||"")}`);
console.log(connectedSockets);

    });

}



const chatGateway:ChatGateway = new ChatGateway();
// Handle socket disconnection and manage connected sockets
  io.on("connection",(socket:IAuthSocket)=>{
  console.log(connectedSockets);
chatGateway.register(socket,getio());
 
discconection(socket);

})




}


export const getio = ():Server=>{
    if(!io) throw new Error("io not initialized");
    return io;
}