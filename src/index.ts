import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import { appContext } from './app-context';
import pino from 'pino';
import pretty from 'pino-pretty';
import { NextFunction, Request, Response } from 'express-serve-static-core';
import {corsHandler} from "./middlewares/cors-handler";
import { structureRouter } from './routers/structure-router';
import { templateRouter } from './routers/template-router';
import { aiRouter } from './routers/ai-router';

const logger = pino({level: process.env.APP_LOG_LEVEL || 'error'}, pretty());

function initApp() {
    const app = express();

    app.use(bodyParser.json());
    app.use(helmet({
        contentSecurityPolicy: false,
    }));
    app.use(corsHandler());
    app.use('/structure', structureRouter);
    app.use('/template', templateRouter);
    app.use('/ai', aiRouter);
    app.set('context', appContext);

    app.use((
        error: Error,
        request: Request,
        response: Response,
        next: NextFunction,
    ): void => {
        logger.error(error);
        response.status(500).json({
            status: 'error',
            message: 'Internal Server Error. See server logs for more information',
        })
    })
    return app;
}

if (!process.env.APP_PORT) {
    logger.error('Env variable process.env.APP_PORT is not set');
    process.exit(0);
}

(async () => {
    const app = initApp();
    app.listen(
        process.env.APP_PORT,
        () => console.log(`Application is listening on ${process.env.APP_PORT}`)
    );
})();
