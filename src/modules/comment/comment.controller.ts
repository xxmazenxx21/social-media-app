import { Router } from "express";
import { authentication } from "../../middelwares/authentication.middelware";
import { endpoints } from "./comment.authorization";
import { tokentypeEnum } from "../../utils/token/token";
import commentService from "./comment.service";

const router : Router = Router({mergeParams:true});



router.post('/',authentication(endpoints.createComment,tokentypeEnum.Access),commentService.createComment)

export default router;
