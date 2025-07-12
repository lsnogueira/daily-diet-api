import { knex as setuKnex } from 'knex';
import { env } from './env';

export const dbConfig = {
  client: env.DATABASE_CLIENT,
  connection: {
    filename: env.DATABASE_URL,
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
};

export const knex = setuKnex(dbConfig);
