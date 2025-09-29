import type { Request, Response, NextFunction } from "express";

export interface IError extends Error {
  statusCode: number;
}

export class ApplicationException extends Error {
  constructor(
    message: string,
    public statusCode: number,
    options?: ErrorOptions
  ) {
    super(message, options);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestException extends ApplicationException {
    constructor(message: string, options?: ErrorOptions) {
        super(message, 400, options);
    }
}

export class ConfilectException extends ApplicationException {
    constructor(message: string, options?: ErrorOptions) {
        super(message, 409, options);
    }
}




export class NotFoundException extends ApplicationException {
    constructor(message: string, options?: ErrorOptions) {
        super(message, 404, options);
    }
}





export const ErrorHandler = (
  err: IError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res.status(err.statusCode||500).json({
    message: err.message || "something went wrong!!",
    stack: process.env.DEV == "dev" ? err.stack : undefined,
    cause: err.cause,
  });
};
