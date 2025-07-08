import fastify from 'fastify';

const app = fastify();

app.get('/', (request, response) => {
  return response.send('hello world');
});

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('daily-diet-api server running! 🏃‍♂️');
  });
