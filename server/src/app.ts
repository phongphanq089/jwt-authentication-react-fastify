import fastify from 'fastify'
import { ENV_CONFIG } from './config/envConfig'
import fastifyCors from '@fastify/cors'
import { registerRoutes } from './routes'
import { zodErrorHandlerPlugin } from './middleware/errorHandlerPlugin'
import fastifyCookie from '@fastify/cookie'

export const buildApp = () => {
  const app = fastify({
    logger: ENV_CONFIG.isDevelopment,
  })

  app.register(fastifyCors, {
    origin: ENV_CONFIG.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  })

  app.get('/', async (request, reply) => {
    return reply.send({
      success: true,
      message:
        ' ✅ ✅ ============= JWT-AUTHENTICATION-REACT-FASTIFY ✅ ✅ =============',
      timestamp: new Date().toISOString(),
    })
  })

  // =======  REGISTER HANDLE ERROR====== //
  app.register(zodErrorHandlerPlugin)

  // ======= RUN REGISTER ROUTE ====== //
  registerRoutes(app)

  app.register(
    fastifyCookie,
    ENV_CONFIG.COOKIE_SECRET
      ? { secret: ENV_CONFIG.COOKIE_SECRET, parseOptions: {} }
      : { parseOptions: {} }
  )

  return app
}
