/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    await knex.schema.createTable('ai_request', function (table) {
        table.increments('id');
        table.string('name', 1024).notNullable();
        table.integer('request_set_id').unsigned().notNullable();
        table.string('state', 50).notNullable();
        table.text('template', 'text');
        table.text('prompt', 'text');
        table.text('response', 'text');
        table.string('error', 1024);
        table.datetime('start_time');
        table.datetime('end_time');

        table
            .foreign('request_set_id', 'fk_ai_request_ai_request_set')
            .references('ai_request_set.id');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.schema.dropTable('ai_request');
};
