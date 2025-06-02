"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// This higher-order function takes an async Express route handler
// and returns a new RequestHandler that properly catches any errors
// and passes them to the next middleware (Express's error handler).
// The key change here is that the 'fn' parameter's return type is now
// more flexible (Promise<any>) to accommodate Express's Response return.
const catchAsync = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.default = catchAsync;
