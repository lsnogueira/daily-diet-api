import fastify from 'fastify';
import { usersRoutes } from './routes/users';
import { env } from './env';
import fastifyCookie from '@fastify/cookie';

const app = fastify();

app.register(fastifyCookie);

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
