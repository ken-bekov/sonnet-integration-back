import Knex from "knex";
import {logger} from "@backend/logger";

export const knexInstance = Knex({
    dialect: 'mysql2',
    client: 'mysql2',
    pool: {
        max: 5
    },
    connection: {
        user: process.env.IDM_DB_USER,
        host: process.env.IDM_DB_HOST || 'localhost',
        password: process.env.IDM_DB_PASSWORD,
        database: 'idm',
    },
});

export async function applyMigrations() {
    try {
        await knexInstance.migrate.latest({directory: `${__dirname}/../migrations`});
        logger.info(`All migrations are applied`);
    } catch (error: any) {
        logger.error(`Couldn't apply migrations. Reason: ${error.message}`);
        process.exit(1);
    }
}