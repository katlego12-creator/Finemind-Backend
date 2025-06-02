// src/utils/catchAsync.ts
import { Request, Response, NextFunction, RequestHandler } from 'express';

// This higher-order function takes an async Express route handler
// and returns a new RequestHandler that properly catches any errors
// and passes them to the next middleware (Express's error handler).
// The key change here is that the 'fn' parameter's return type is now
// more flexible (Promise<any>) to accommodate Express's Response return.
const catchAsync = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default catchAsync;