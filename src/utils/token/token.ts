import {sign,Secret,SignOptions, verify, JwtPayload} from 'jsonwebtoken'
import {HUserDocument, RoleEnum, UserModel} from '../../DB/Models/User.model'
import { NotFoundException, unAuthoriazedException } from "../response/error.response"
import { UserRepository } from '../../DB/repositories/User.repository'
import { TokenRepository } from '../../DB/repositories/Token.repository'
import { TokenModel } from '../../DB/Models/token.model'
import {v4 as uuid} from 'uuid'
export enum SignatureLevelEnum  {
    User ="User",
    Admin = "Admin"
}


export enum logOutEnum  {
    Only ="only",
    All = "all"
}


export enum tokentypeEnum  {
    Access ="Access",
    Refresh = "Refresh"
}


export const generateToken = async({payload,secret=process.env.ACCESS_USER_SIGNATURE as string,options={expiresIn:'1d'}}
    :{payload:object,secret?:Secret,options?:SignOptions}):Promise<string>=>{
  
  
    return await sign(payload,secret,options)

                        
}



export const verifyToken = async({token,secret=process.env.ACCESS_USER_SIGNATURE as string}
    :{token:string,secret?:Secret}):Promise<JwtPayload>=>{
  
  
    return await verify(token,secret,) as JwtPayload

                        
}



export const  getSingaturelevel = async(role:RoleEnum = RoleEnum.User)=>{
    let SignatureLevel : SignatureLevelEnum = SignatureLevelEnum.User ;
switch (role) {
    case RoleEnum.User:
        SignatureLevel = SignatureLevelEnum.User;
        break;
    case RoleEnum.Admin:
        SignatureLevel = SignatureLevelEnum.Admin;
        break;
    default:
        break;
}
return SignatureLevel
}





export const  getSignature = async(SignatureLevel:SignatureLevelEnum=SignatureLevelEnum.User)=>{
   
let Signatures :{accessSignature:string,refreshSignature:string}  = {accessSignature :"" ,refreshSignature : ""} 

switch (SignatureLevel) {
    case SignatureLevelEnum.User:
        Signatures.accessSignature = process.env.ACCESS_USER_SIGNATURE as string
        Signatures.refreshSignature = process.env.REFRESH_USER_SIGNATURE as string
        
        break;
        case SignatureLevelEnum.Admin:
            Signatures.accessSignature = process.env.ACCESS_ADMIN_SIGNATURE as string
            Signatures.refreshSignature = process.env.REFRESH_ADMIN_SIGNATURE as string
            break ;
    default:
    break;
  
}
return Signatures

}





export const createLoginCredentials = async(user: HUserDocument)=>{

const SignatureLevel = await getSingaturelevel(user.role); 
const Signatuers = await getSignature(SignatureLevel); 
const jwtid = uuid();
const accessToken = await generateToken({payload:{_id:user._id},secret:Signatuers.accessSignature , options:{expiresIn:Number(process.env.ACCESS_EXPIRES_IN),jwtid}})

const refreshToken = await generateToken({payload:{_id:user._id},secret:Signatuers.refreshSignature , options:{expiresIn:Number(process.env.REFRESH_EXPIRES_IN),jwtid}})

return {accessToken,refreshToken}; 

}



export const decodedToken = async({authorization , tokentype= tokentypeEnum.Access}:{authorization:string,tokentype?:tokentypeEnum })=>{
const usermodel = new UserRepository(UserModel);
const tokenmodel = new TokenRepository(TokenModel);


    const [bearer,token] = authorization.split(" ");
    if(!bearer || !token)throw new unAuthoriazedException("missing token");
const signature = await getSignature(bearer as SignatureLevelEnum);

const decoded = await verifyToken({token,secret:tokentype===tokentypeEnum.Refresh?signature.refreshSignature:signature.accessSignature})
if(!decoded?._id||!decoded?.iat)
    throw new unAuthoriazedException("invalid token payload");

if(await tokenmodel.findone({filter:{jti:decoded.jti}}))
    throw new unAuthoriazedException("token is invalid credentials ");

const user = await usermodel.findone({filter:{_id:decoded._id}})

if(user?.changeCredentilesTime || 0 > decoded?.iat*1000)
    throw new unAuthoriazedException("token is invalid credentials");
if(!user)throw new NotFoundException("user not found ")
return {user,decoded};


};



export const revokeToken = async(decoded : JwtPayload) => {
    const tokenmodel = new TokenRepository(TokenModel);
    const [result] =  await tokenmodel.create({
        data: [
          {
            jti: decoded?.jti as string,
            userId: decoded?.id,
            expiresIn:
              (decoded?.iat as number) +
              Number(process.env.ACCESS_EXPIRES_IN),
          },
        ],
        options: { validateBeforeSave: true },
      }) ||[];

      if(!result)throw new NotFoundException("filed to revoke token ");
return result ;

};