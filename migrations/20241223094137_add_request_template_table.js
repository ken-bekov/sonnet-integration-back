/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.schema.createTable('ai_query_templates', function (table) {
        table.increments('id');
        table.bigint('agent_id');
        table.text('text', 'text');
        table.datetime('modified_at');
        table.foreign('agent_id', 'fk_agent_ai_query_template')
            .references('agents.id')
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTable('ai_query_templates');
};
