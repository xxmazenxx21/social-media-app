import { RoleEnum } from "../../DB/Models/User.model";


export const endpoints = {
profile : [RoleEnum.User,RoleEnum.Admin],
logOut : [RoleEnum.User,RoleEnum.Admin],
refreshToken : [RoleEnum.User,RoleEnum.Admin],
profileImage : [RoleEnum.User,RoleEnum.Admin],
friendRequest : [RoleEnum.User,RoleEnum.Admin],
acceptRequest : [RoleEnum.User,RoleEnum.Admin],
}