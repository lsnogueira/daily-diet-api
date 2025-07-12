import { FastifyInstance } from 'fastify';
import z from 'zod';
import { knex } from '../database';
import { randomUUID } from 'node:crypto';

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createUserSchema = z.object({
      email: z.email(),
      name: z.string(),
    });

    const parseResult = createUserSchema.safeParse(request.body);

    if (!parseResult.success) {
      return reply.status(400).send('Objeto inválido');
    }

    const { email, name } = parseResult.data;

    const existingUser = await knex('users')
      .select('email')
      .where({ email })
      .first();

    if (existingUser) {
      return reply.status(409).send('Usuário já existente');
    }

    const session_id = randomUUID();

    await knex('users').insert({
      id: randomUUID(),
      email,
      name,
      session_id,
    });

    reply.setCookie('sessionId', session_id, {
      path: '/',
      maxAge: 60 * 15, // 15 minutes
    });

    return reply.status(201).send();
  });

  app.post('/login', async (request, reply) => {
    const loginSchema = z.object({ email: z.email() });

    const parseResult = loginSchema.safeParse(request.body);

    if (!parseResult.success) {
      return reply.status(400).send('Objeto inválido');
    }

    const { email } = parseResult.data;

    const user = await knex('users').select('*').where('email', email).first();

    if (!user) {
      return reply.status(404).send('Usuário não encontrado');
    }

    const sessionId = randomUUID();

    await knex('users').update('session_id', sessionId).where('email', email);

    reply.setCookie('sessionId', sessionId, {
      path: '/',
      maxAge: 60 * 15, // 15 minutes
    });

    return reply.send();
  });
}
