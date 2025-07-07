import { FastifyReply } from 'fastify'

export const sendResponse = (
  reply: FastifyReply,
  message: string,
  result?: any
) => {
  return reply.send({
    success: true,
    message,
    ...(result !== undefined && { result }),
  })
}
