import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('users');
  await knex.schema.createTable('users', (tableBuilder) => {
    tableBuilder.uuid('id').primary();
    tableBuilder.string('email').notNullable().unique();
    tableBuilder.string('name').notNullable();
    tableBuilder.string('session_id').unique().notNullable();
    tableBuilder.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users');
}
