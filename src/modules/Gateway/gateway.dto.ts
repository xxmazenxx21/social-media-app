import { Socket } from "socket.io"
import { HUserDocument } from "../../DB/Models/User.model"
import { JwtPayload } from "jsonwebtoken"

export interface IAuthSocket extends Socket{
Credentials?:{
    user:Partial<HUserDocument>,
    decoded:JwtPayload
}
}