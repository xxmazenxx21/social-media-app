import { Router } from "express";
import { authentication } from "../../middelwares/authentication.middelware";
import userService from "./user.service";
import { endpoints } from "./user.authorization";
import { cloudUpload, fileValidation, StorageEnum } from "../../utils/mullter/cloud.multer";
import { tokentypeEnum } from "../../utils/token/token";
import { validation } from "../../middelwares/validation.middelware";
import * as validators from "./user.validation";




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
  cloudUpload({ storageApproach:StorageEnum.MEMORY , validation:fileValidation.image}).single("image"),
  userService.profileImage
);


router.patch(
    "/cover-imagesUpload",
    authentication(endpoints.profileImage, tokentypeEnum.Access),
    cloudUpload({ storageApproach:StorageEnum.MEMORY , validation:fileValidation.image}).array("Images",10),
    userService.coverimagesUpload
  );




router.post(
  "/:userid/Friend-Request",
  authentication(endpoints.friendRequest, tokentypeEnum.Access),
  validation(validators.FriendRequest),
  userService.sendFriendRequest
);




router.patch(
  "/:requestid/accept-Request",
  authentication(endpoints.acceptRequest, tokentypeEnum.Access),
  validation(validators.acceptRequest),
  userService.AcceptFriendRequest
);






export default router;
