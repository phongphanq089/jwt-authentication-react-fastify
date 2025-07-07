import { FastifyInstance } from 'fastify'
import { authRoute } from './auth.route'

export const registerRoutes = (app: FastifyInstance) => {
  // ===== REGISTER ROUTE V1 ======== //
  app.register(
    async (v1App) => {
      v1App.register(authRoute, { prefix: '/auth' }) // =====> /api/v1/auth, /api/v1/product ,....
    },
    { prefix: '/api/v1' }
  )
  // ===== REGISTER ROUTE V2 ======== //
  app.register(
    async (v2App) => {
      v2App.register(authRoute, { prefix: '/auth' }) // =====> /api/v2/auth, /api/v2/product ,....
    },
    { prefix: '/api/v2' }
  )
}
