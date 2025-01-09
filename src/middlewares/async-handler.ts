import { Request, Response, NextFunction } from 'express';

interface AsyncHandler {
    (request: Request, response: Response, next: NextFunction): Promise<any>;
}

export const asyncHandler = (asyncCallback: AsyncHandler) => {
    return (request: Request, response: Response, next: NextFunction) => {
        Promise
            .resolve(asyncCallback(request, response, next))
            .catch((error) => next(error));
    }
}
