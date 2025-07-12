import { FastifyReply, FastifyRequest } from 'fastify';

export async function verifySessionId(
  request: FastifyRequest,
  reply: FastifyReply
) {
  let sessionId = request.cookies.sessionId;

  if (!sessionId) {
    return reply.status(401).send('Unauthorized');
  }
}
