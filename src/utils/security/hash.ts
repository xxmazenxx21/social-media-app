
import {hash , compare} from "bcrypt";


export const generateHash = async (plainText:string,
    saltRounds:number = Number(process.env.SALT as string)
): Promise<string> => {
   
return  hash(plainText,saltRounds);

};

export const compareHash = async (plainText: string, hashedText: string): Promise<boolean> => {
    return await compare(plainText, hashedText);
   
};
