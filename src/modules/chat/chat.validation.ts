import z from "zod";
import { generalfields } from "../../middelwares/validation.middelware";

export const getchatSchema = {
  params: z.strictObject({
        userid: generalfields.id
    })

}
  

export const createGroupSchema = {
  body: z.strictObject({
        participants:z.array(generalfields.id),
        group:z.string().min(3).max(100)
    }).superRefine((data,ctx)=>{
          if(data.participants?.length && data.participants.length !== [...new Set(data.participants)].length){
            ctx.addIssue({
                code:'custom',
               path : ['participants'],
               message:' must be unique'
            })
        }
    })

}

export const getGroupChatSchema = {
  params: z.strictObject({
        groupid: z.string().min(1, { message: 'groupid is required' })
    })
}
  