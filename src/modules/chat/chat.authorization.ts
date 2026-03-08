
import { RoleEnum } from "../../DB/Models/User.model";


export const endpoints = {
getChat : [RoleEnum.User,RoleEnum.Admin],
createGroup : [RoleEnum.User,RoleEnum.Admin],
getGroupChat : [RoleEnum.User,RoleEnum.Admin]
}