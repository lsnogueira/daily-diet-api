import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (tableBuilder) => {
    tableBuilder.string('email').primary();
    tableBuilder.string('nome').notNullable();
    tableBuilder.string('session_id').unique().notNullable();
    tableBuilder.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users');
}
