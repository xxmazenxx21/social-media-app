import { Router } from "express";
import { authentication } from "../../middelwares/authentication.middelware";
import userService from "./user.service";
import { endpoints } from "./user.authorization";
import { tokentypeEnum } from "../../utils/token/token";



const router = Router();






router.get("/profile",authentication(endpoints.profile),userService.profile)



router.post("/log-out",authentication(endpoints.logOut),userService.logOut)



router.post("/refreshToken",authentication(endpoints.refreshToken,tokentypeEnum.Refresh),userService.RefreshToken)


export default router;
