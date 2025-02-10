/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    await knex.schema.createTable('ai_request_set', function (table) {
        table.increments('id');
        table.bigint('agent_id').notNullable();

        table
            .foreign('agent_id', 'fk_ai_request_set_agent')
            .references('agents.id');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.schema.dropTable('ai_request_ste');
};
