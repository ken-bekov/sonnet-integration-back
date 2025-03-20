/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.schema.alterTable('ai_request_set', table => {
        table.string('state', 50).defaultTo('processing');
        table.string('error', 1024).defaultTo('');
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    await knex.schema.alterTable('ai_request_set', table => {
        table.dropColumn('state');
        table.dropColumn('error');
    })
};
