import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import {appContext} from './app-context';
import {corsHandler} from "./middlewares/cors-handler";
import { router as structureRouter } from './routers/structure-router';
import { templateRouter } from './routers/template-router';
import { aiRouter } from './routers/ai-router';
import {errorHandler} from "@backend/middlewares/error-handler";
import {applyMigrations} from "@backend/knex-instance";
import {logger} from "@backend/logger";
import {router as queryRouter} from "@backend/routers/request-router";

function initApp() {
    const app = express();

    app.use(bodyParser.json({limit: '2mb'}));
    app.use(helmet({
        contentSecurityPolicy: false,
    }));
    app.use(corsHandler());
    app.use('/structure', structureRouter);
    app.use('/template', templateRouter);
    app.use('/ai', aiRouter);
    app.use('/query', queryRouter);
    app.set('context', appContext);

    app.use(errorHandler());

    return app;
}

if (!process.env.APP_PORT) {
    logger.error('Env variable process.env.APP_PORT is not set');
    process.exit(1);
}

(async () => {
    if (process.argv.includes('migrate')) {
        await applyMigrations();
    } else {
        logger.info('Migrations are skipped');
    }

    const app = initApp();
    app.listen(
        process.env.APP_PORT,
        () => logger.info(`Application is listening on ${process.env.APP_PORT}`)
    );
})();
