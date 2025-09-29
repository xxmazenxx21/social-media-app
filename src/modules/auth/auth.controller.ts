import { Router } from "express";

import  authservice from './auth.service'
import { validation } from "../../middelwares/validation.middelware";
import { SignupSchema,ConfirmEmailSchema,loginSchema } from "./auth.validation";

const router = Router();



router.post('/signup',validation(SignupSchema),authservice.signup)
router.post('/login',validation(loginSchema),authservice.login)

router.patch('/confirm-email',validation(ConfirmEmailSchema),authservice.confirmEmail)




export default router;
