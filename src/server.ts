import fastify from 'fastify';
import fastifyCookie from '@fastify/cookie';
import { env } from './env';
import { mealsRoutes, usersRoutes } from './routes';

const app = fastify();

app.register(fastifyCookie);

app.get('/health', (_, reply) => {
  return reply.send('OK');
});

app.register(usersRoutes, {
  prefix: '/users',
});

app.register(mealsRoutes, {
  prefix: '/meals',
});

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log(`daily-diet-api server running on port ${env.PORT}! 🏃`);
  });
