import z from "zod";
import { generalfields } from "../../middelwares/validation.middelware";
import { fileValidation } from "../../utils/mullter/cloud.multer";


export const  createCommentSchema ={
params :z.strictObject({
    postid:generalfields.id
}),
body:z.strictObject({
    content : z.string().min(2).max(5000).optional(),
    attachments:z.array(generalfields.file(fileValidation.image)).optional(),
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

};

export const  ReplyCommentSchema ={
params:createCommentSchema.params.extend({commentid:generalfields.id}),
body :createCommentSchema.body

}