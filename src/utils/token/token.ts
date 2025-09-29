import {sign,Secret,SignOptions} from 'jsonwebtoken'


export const generateToken = async({payload,secret=process.env.ACCESS_USER_SIGNATURE as string,options={expiresIn:'1d'}}
    :{payload:object,secret?:Secret,options?:SignOptions}):Promise<string>=>{
  
  
    return await sign(payload,secret,options)

                        
}