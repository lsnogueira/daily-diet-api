import { Knex } from 'knex';

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      email: string;
      nome: string;
      session_id: string;
      created_at: string;
    };
  }
}
