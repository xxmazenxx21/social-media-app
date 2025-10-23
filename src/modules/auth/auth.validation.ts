import z from 'zod'  
import { generalfields } from '../../middelwares/validation.middelware'


export const SignupSchema = {

body:z.strictObject({
   username : generalfields.username ,
   email : generalfields.email ,
   password : generalfields.password ,
   confirmPassword : generalfields.confirmPassword 
}).refine((data)=> data.password ===data.confirmPassword,{error:'password and confirmPassword must be the same '})


}



export const loginSchema = {

   body:z.strictObject({
    
      email : generalfields.email ,
      password : generalfields.password ,
     
   })
   
   }
   
   
   

export const ConfirmEmailSchema = {

   body:z.strictObject({
    
      email : generalfields.email ,
      otp : generalfields.otp
     
   })
   
   
   }
   