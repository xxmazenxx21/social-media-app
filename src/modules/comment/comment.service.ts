import type { Request, Response, NextFunction } from "express";


class commentService {

  constructor() {}

  createComment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
   
console.log(req.params);
    return res.status(200).json({ message: "comment created succesfuly" });
  };



  
}

export default new commentService();
