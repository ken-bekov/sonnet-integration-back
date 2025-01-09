import {NextFunction, Request, Response} from "express";

export const corsHandler = () => (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    if (request.method === 'OPTIONS' && request.get('Access-Control-Request-Method')) {
        response.set('Access-Control-Allow-Origin', '*');
        response.set('Access-Control-Allow-Methods', 'GET, POST, UPDATE, PUT');
        response.set('Access-Control-Allow-Headers', '*');
        response.set('Access-Control-Max-Age', '3600');
        response.sendStatus(204);
        return;
    }

    response.header('Access-Control-Allow-Origin', '*');
    next();
}