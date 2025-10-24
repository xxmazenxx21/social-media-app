import z from 'zod' 
import { logOutEnum } from '../../utils/token/token'
import { generalfields } from '../../middelwares/validation.middelware'


export const logoutSchema = {

   body:z.strictObject({
    
      flag : z.enum(logOutEnum).default(logOutEnum.Only),
     
   }),
   
   
   }
   
export const FriendRequest = {

   params:z.strictObject({
    
      userid : generalfields.id
     
   }),
   

   
   }
   

      
export const acceptRequest = {

   params:z.strictObject({
    
      requestid : generalfields.id
     
   }),
}