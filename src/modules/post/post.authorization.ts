import { RoleEnum } from "../../DB/Models/User.model";


export const endpoints = {
createPost : [RoleEnum.User,RoleEnum.Admin],
getpost : [RoleEnum.User,RoleEnum.Admin],


}