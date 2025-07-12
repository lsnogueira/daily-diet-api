import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  knex.schema.createTable('meals', (tableBuilder) => {
    tableBuilder.uuid('id').primary();
    tableBuilder.uuid('user_id').references('users.id').notNullable();
    tableBuilder.string('name').notNullable();
    tableBuilder.string('description').notNullable();
    tableBuilder.date('date').notNullable();
    tableBuilder.boolean('on_diet').notNullable();
    tableBuilder.timestamp('created_at').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {}
