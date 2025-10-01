import z from 'zod' 
import { logOutEnum } from '../../utils/token/token'


export const logoutSchema = {

   body:z.strictObject({
    
      flag : z.enum(logOutEnum).default(logOutEnum.Only),
     
   }),
   
   
   }
   