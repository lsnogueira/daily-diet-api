import fastify from 'fastify';
import { usersRoutes } from './routes/users';
import { env } from './env';

const app = fastify();

app.get('/health', (_, reply) => {
  return reply.send('OK');
});

app.register(usersRoutes, {
  prefix: '/users',
});

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log(`daily-diet-api server running on port ${env.PORT}! 🏃`);
  });
