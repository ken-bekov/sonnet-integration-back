const knex = require("knex");

const knexInstance = knex({
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
    }
});

const migrate = async () => {
    try {
        await knexInstance.migrate.latest({directory: `${__dirname}/migrations`});
        console.log('Migration applied');
    } catch (error) {
        console.log(error);
    }
    await knexInstance.destroy();
}

(async () => migrate())();
