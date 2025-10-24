import { RoleEnum } from "../../DB/Models/User.model";


export const endpoints = {
createComment: [RoleEnum.User,RoleEnum.Admin],
replycomment :  [RoleEnum.User,RoleEnum.Admin],
}