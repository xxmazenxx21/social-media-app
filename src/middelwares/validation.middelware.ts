import { Request, Response, NextFunction } from "express";
import { ZodError, ZodType } from "zod";
import { BadRequestException } from "../utils/response/error.response";
import z from 'zod'  

type RequestType = keyof Request;
type SchemaType = Partial<Record<RequestType, ZodType>>;

export const validation = (schema: SchemaType) => {
  return (req: Request, res: Response, next: NextFunction) => {

    const ValidationErrors: Array<{
      key: RequestType;
      issues: Array<{ message: string; path: (string | number | symbol)[] }>;
    }> = [];

    for (const key of Object.keys(schema) as RequestType[]) {
      if (!schema[key]) continue;
      const validationResult = schema[key].safeParse(req[key]);
      if (!validationResult.success) {
        const error = validationResult.error as ZodError;
        ValidationErrors.push({    
          key,
          issues: error.issues.map((issue) => ({
            path: issue.path,
            message: issue.message,
          })),
        });
      }
      if (ValidationErrors.length > 0) {
        throw new BadRequestException("validation Error", {
          cause: ValidationErrors,
        });
      }
    }

    return next() as unknown as NextFunction;
  };
};



export const generalfields = {
    username:z.string({error:'name must be a string'}).min(3,{error:'name must be at least 3 characters '}).max(25,{error:'name must be at most 25 characters '}),
    email:z.email({error:'email must be a valid email '}),
    password:z.string({error:'password must be a string '}) ,
    confirmPassword:z.string({error:'confirmPassword must be a string '}),
    otp:z.string({error:'otp must be a string '})


}