import z from "zod";
import { ActionEnum, AllowCommnetsEnum , AvilbiltyEnum} from "../../DB/Models/post.model";
import { generalfields } from "../../middelwares/validation.middelware";
import { fileValidation } from "../../utils/mullter/cloud.multer";

export const createPostSchema ={
body:z.strictObject({
content : z.string().min(2).max(5000).optional(),
 attachments:z.array(generalfields.file(fileValidation.image)).optional(),
 allowComments  : z.enum(AllowCommnetsEnum).default(AllowCommnetsEnum.ALLOW),
 Avilabilty : z.enum(AvilbiltyEnum).default(AvilbiltyEnum.PUBLIC),
  tags : z.array(generalfields.id).max(10).optional(),

}).superRefine((data,ctx)=>{

    if(!data.attachments?.length&&!data.content){
        ctx.addIssue({
            code:'custom',
           path : ['content'],
           message:'content or attachments is required'
        })
       
    } 
    if(data.tags?.length && data.tags.length !== [...new Set(data.tags)].length){
            ctx.addIssue({
                code:'custom',
               path : ['tags'],
               message:'tags must be unique'
            })
        }

})



}




export const UpdatePostSchema ={
params:z.strictObject({
postid : generalfields.id
})
,body:z.strictObject({
content : z.string().min(2).max(5000).optional(),
 attachments:z.array(generalfields.file(fileValidation.image)).optional(),
 allowComments  : z.enum(AllowCommnetsEnum).default(AllowCommnetsEnum.ALLOW),
 Avilabilty : z.enum(AvilbiltyEnum).default(AvilbiltyEnum.PUBLIC),
  tags : z.array(generalfields.id).max(10).optional(),
  Removetags : z.array(generalfields.id).max(10).optional(),
  Removeattachments: z.array(z.string()).max(10).optional()

}).superRefine((data,ctx)=>{

    if(!data.attachments?.length&&!data.content){
        ctx.addIssue({
            code:'custom',
           path : ['content'],
           message:'content or attachments is required'
        })
       
    } 
    if(data.tags?.length && data.tags.length !== [...new Set(data.tags)].length){
            ctx.addIssue({
                code:'custom',
               path : ['tags'],
               message:'tags must be unique'
            })
        }


 if(data.Removetags?.length && data.Removetags.length !== [...new Set(data.Removetags)].length){
            ctx.addIssue({
                code:'custom',
               path : ['Removetags'],
               message:'Removetags must be unique'
            })
        }


})



}




export const likeAndunlikePostSchema ={
params:z.strictObject({
postid : generalfields.id

}),
query : z.strictObject({
    action : z.enum(ActionEnum).default(ActionEnum.LIKE)
})

}