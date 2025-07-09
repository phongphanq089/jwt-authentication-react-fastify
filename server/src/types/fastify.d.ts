// types/fastify.d.ts
import 'fastify'

declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      _id: string
      email: string
      role?: string
    }
  }
}
