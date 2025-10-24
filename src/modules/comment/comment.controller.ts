import { Router } from "express";
import { authentication } from "../../middelwares/authentication.middelware";
import { endpoints } from "./comment.authorization";
import { tokentypeEnum } from "../../utils/token/token";
import commentService from "./comment.service";
import * as validators from './comment.validation';
import { validation } from "../../middelwares/validation.middelware";
import { cloudUpload, fileValidation } from "../../utils/mullter/cloud.multer";
const router : Router = Router({mergeParams:true});



router.post('/',authentication(endpoints.createComment,tokentypeEnum.Access),
cloudUpload({validation:fileValidation.image}).array('attachments',3),
validation(validators.createCommentSchema),
commentService.createComment)

router.post('/:commentid/reply',authentication(endpoints.replycomment,tokentypeEnum.Access),
cloudUpload({validation:fileValidation.image}).array('attachments',3),
validation(validators.ReplyCommentSchema),
commentService.ReplyComment)


export default router;
