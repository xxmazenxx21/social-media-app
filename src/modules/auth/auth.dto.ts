import z from 'zod'
import { SignupSchema } from './auth.validation'
export type ISignupDTO  = z.infer<typeof SignupSchema.body>