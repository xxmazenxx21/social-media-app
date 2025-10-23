import z from "zod";
import { likeAndunlikePostSchema } from "./post.validation";


export type likeAndunlikePostDto = z.infer<typeof likeAndunlikePostSchema.query>