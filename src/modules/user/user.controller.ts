import { Router } from "express";
import { authentication } from "../../middelwares/authentication.middelware";
import userService from "./user.service";
import { endpoints } from "./user.authorization";
import { cloudUpload, fileValidation, StorageEnum } from "../../utils/mullter/cloud.multer";
import { tokentypeEnum } from "../../utils/token/token";




const router = Router();

router.get("/profile", authentication(endpoints.profile), userService.profile);

router.post("/log-out", authentication(endpoints.logOut), userService.logOut);

router.post(
  "/refreshToken",
  authentication(endpoints.refreshToken, tokentypeEnum.Refresh),
  userService.RefreshToken
);

router.patch(
  "/profileimageUpload",
  authentication(endpoints.profileImage, tokentypeEnum.Access),
  cloudUpload({ storageApproach:StorageEnum.MEMORY , validation:fileValidation.image}).single("profileImage"),
  userService.profileImage
);


router.patch(
    "/cover-imagesUpload",
    authentication(endpoints.profileImage, tokentypeEnum.Access),
    cloudUpload({ storageApproach:StorageEnum.MEMORY , validation:fileValidation.image}).array("Images",10),
    userService.coverimagesUpload
  );

export default router;
