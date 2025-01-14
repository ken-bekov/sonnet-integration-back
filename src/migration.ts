import {appContext} from "@backend/app-context";
import pino from "pino";
import pretty from "pino-pretty";
const logger = pino({level: process.env.APP_LOG_LEVEL || 'error'}, pretty());

async function applyMigrations() {
    const {knex} = appContext;
    try {
        await knex.migrate.latest({directory: `${__dirname}/../migrations`});
        logger.info(`All migrations applied`);
    } catch (error: any) {
        logger.error(`Couldn't apply migrations. Reason: ${error.message}`);
        process.exit(0);
    }
}

(async () => {
    await applyMigrations();
})();