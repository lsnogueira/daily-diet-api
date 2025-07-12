import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';
import { knex } from '../database';

export async function isSameUserMeal(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const paramsSchema = z.object({
    id: z.uuid(),
  });
  const { id } = paramsSchema.parse(request.params);
  const { sessionId } = request.cookies;

  const existingMeal = await knex('meals').select().where('id', id).first();
  const userId = await knex('users')
    .select('id')
    .where('session_id', sessionId)
    .first();

  if (existingMeal?.user_id !== userId?.id) {
    return reply.status(401).send('Unauthorized');
  }
}
