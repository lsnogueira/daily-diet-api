import { FastifyInstance } from 'fastify';
import z from 'zod';
import { verifySessionId } from '../middlewares/verify-session-id';
import { knex } from '../database';
import { randomUUID } from 'node:crypto';
import { isSameUserMeal } from '../middlewares/is-same-user-meal';

export async function mealsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', verifySessionId);

  app.post('/', async (request, reply) => {
    const createMealsSchema = z.object({
      name: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      isOnDiet: z.boolean(),
    });

    const { sessionId } = request.cookies;
    const {
      name,
      description,
      date,
      isOnDiet: on_diet,
    } = createMealsSchema.parse(request.body);
    const userId = await knex('users')
      .select('id')
      .where('session_id', sessionId)
      .first();

    await knex('meals').insert({
      id: randomUUID(),
      user_id: userId?.id,
      name,
      description,
      date,
      on_diet,
    });

    return reply.status(201).send();
  });

  app.get('/', async (request, reply) => {
    const user = await knex('users')
      .select('id')
      .where('session_id', request.cookies['sessionId'])
      .first();

    if (!user) {
      return reply.status(404).send('User not found');
    }

    return await knex('meals').select('*').where('user_id', user['id']);
  });

  app.delete(
    '/:id',
    { preHandler: [isSameUserMeal] },
    async (request, reply) => {
      const deleteSchema = z.object({
        id: z.uuid(),
      });
      const { id } = deleteSchema.parse(request.params);
      const existingMeal = await knex('meals').select().where('id', id).first();

      if (!existingMeal)
        return reply.status(404).send('Refeição não encontrada');

      await knex('meals').delete().where('id', id);

      return reply.status(204).send();
    }
  );

  app.get('/:id', { preHandler: [isSameUserMeal] }, async (request, reply) => {
    const deleteSchema = z.object({
      id: z.uuid(),
    });
    const { id } = deleteSchema.parse(request.params);
    const existingMeal = await knex('meals').select().where('id', id).first();

    if (!existingMeal) return reply.status(404).send('Refeição não encontrada');

    return await knex('meals').select().where('id', id).first();
  });

  app.put('/:id', { preHandler: [isSameUserMeal] }, async (request, reply) => {
    const editMealsSchema = z.object({
      name: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      isOnDiet: z.boolean(),
    });

    const paramsSchema = z.object({
      id: z.uuid(),
    });
    const { id } = paramsSchema.parse(request.params);
    const existingMeal = await knex('meals').select().where('id', id).first();

    const {
      name,
      description,
      date,
      isOnDiet: on_diet,
    } = editMealsSchema.parse(request.body);

    await knex('meals')
      .update({
        ...existingMeal,
        name,
        description,
        date,
        on_diet,
      })
      .where('id', existingMeal?.id);

    return reply.send();
  });

  app.get('/summary', async (request, reply) => {
    const user = await knex('users')
      .select('id')
      .where('session_id', request.cookies['sessionId'])
      .first();

    if (!user) return reply.status(404).send('unauthorized');
    const userId = user.id;

    const meals = await knex('meals')
      .select()
      .where('user_id', userId)
      .orderBy('date', 'asc');
    const mealsOnDietQuantity = (
      await knex('meals').select().where({
        user_id: userId,
        on_diet: true,
      })
    ).length;

    const mealsStreakInDiet = meals.reduce(
      (result, meal) => {
        if (meal.on_diet) {
          result.current++;
          result.max = Math.max(result.max, result.current);
        } else {
          result.current = 0;
        }
        return result;
      },
      { current: 0, max: 0 }
    ).max;

    return reply.send({
      mealsQuantity: meals.length,
      mealsOnDietQuantity,
      mealsOutOfDietQuantity: meals.length - mealsOnDietQuantity,
      mealsStreakInDiet,
    });
  });
}
