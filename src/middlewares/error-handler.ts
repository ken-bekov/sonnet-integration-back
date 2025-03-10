import {NextFunction, Request, Response} from "express-serve-static-core";
import {logger} from "@backend/logger";

export function errorHandler() {
    return (
        error: Error,
        request: Request,
        response: Response,
        next: NextFunction,
    ) => {
        logger.error(error);

        response.status(500).json({
            status: 'error',
            message: 'Internal Server Error. See server logs for more information',
        });
    }
}