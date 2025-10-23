import { Router } from "express";
import postService from "./post.service";
import { authentication } from "../../middelwares/authentication.middelware";
import * as validators from './post.validation';
import { endpoints } from "./post.authorization";
import { tokentypeEnum } from "../../utils/token/token";
import { cloudUpload, fileValidation } from "../../utils/mullter/cloud.multer";
import { validation } from "../../middelwares/validation.middelware";
import  commentRouter from './../comment/comment.controller'
const router : Router = Router();

router.use('/:postid/comment',commentRouter)


router.post('/',authentication(endpoints.createPost,tokentypeEnum.Access),
cloudUpload({validation:fileValidation.image}).array('attachments',3)
,validation(validators.createPostSchema)
,postService.createPost)


router.patch('/:postid/like',authentication(endpoints.createPost,tokentypeEnum.Access),
validation(validators.likeAndunlikePostSchema)
,postService.likeAndunlikepost)


router.patch('/updatePost/:postid',authentication(endpoints.createPost,tokentypeEnum.Access),cloudUpload({validation:fileValidation.image}).array('attachments',3),
validation(validators.UpdatePostSchema)
,postService.updatePost)





router.get('/getpost',authentication(endpoints.getpost,tokentypeEnum.Access)
,postService.getPost)


export default router;
