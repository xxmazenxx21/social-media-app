
import { HUserDocument } from "../../DB/Models/User.model";
import { JwtPayload } from "jsonwebtoken";

declare module "express-serve-static-core" {


    interface  Request {
    
        user?: HUserDocument ;
        decoded?: JwtPayload ;
    }
    
}
    