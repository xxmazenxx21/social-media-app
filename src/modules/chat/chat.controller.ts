import { Router } from "express";
import { authentication } from "../../middelwares/authentication.middelware";
import { endpoints } from "./chat.authorization";
import { tokentypeEnum } from "../../utils/token/token";
import { validation } from "../../middelwares/validation.middelware";
import * as validators from "./chat.validation";
import  chatservice from "./chat.service";
const router = Router({mergeParams:true});

router.get("/", 
    authentication(endpoints.getChat,tokentypeEnum.Access),
validation(validators.getchatSchema),
chatservice.getchat);

router.post("/group", 
    authentication(endpoints.createGroup,tokentypeEnum.Access),
validation(validators.createGroupSchema),
chatservice.createGroup);

router.get("/group/:groupid",
    authentication(endpoints.getGroupChat,tokentypeEnum.Access),
validation(validators.getGroupChatSchema),
chatservice.getGroupChat);


export default router;
