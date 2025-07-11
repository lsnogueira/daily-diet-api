import { env } from './env';

export const knex = require('knex')({
  client: env.DATABASE_CLIENT,
  connection: {
    filename: env.DATABASE_URL,
  },
});
