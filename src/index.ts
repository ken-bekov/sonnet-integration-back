import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import {appContext, logger} from './app-context';
import {corsHandler} from "./middlewares/cors-handler";
import { structureRouter } from './routers/structure-router';
import { templateRouter } from './routers/template-router';
import { aiRouter } from './routers/ai-router';
import {errorHandler} from "@backend/middlewares/error-handler";

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

    app.use(errorHandler());

    return app;
}

if (!process.env.APP_PORT) {
    logger.error('Env variable process.env.APP_PORT is not set');
    process.exit(0);
}

async function applyMigrations() {
    const {knex} = appContext;
    try {
        await knex.migrate.latest({directory: `${__dirname}/../migrations`});
        logger.info(`All migrations are applied`);
    } catch (error: any) {
        logger.error(`Couldn't apply migrations. Reason: ${error.message}`);
        process.exit(0);
    }
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
