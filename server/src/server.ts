import { buildApp } from './app'
import { database } from './config/dbFakeConfig'
import { ENV_CONFIG } from './config/envConfig'
import { logger, LOGGER_CONSOLE } from './utils/logger'

const server = buildApp()

const startServer = async () => {
  try {
    await server.listen({ port: ENV_CONFIG.port, host: ENV_CONFIG.host })

    // ===== START DATABASE ============//
    await database.initializeData()

    // ====== CONFIG LOG ERROR ============ //
    LOGGER_CONSOLE.logStartupInfo()
  } catch (error) {
    logger.error('❌ Error starting server:', error)
    process.exit(1)
  }
}

process.on('SIGINT', () => {
  logger.info('🛑 SIGINT received. Exiting...')
  process.exit(0)
})

process.on('SIGTERM', () => {
  logger.info('🛑 SIGTERM received. Exiting...')
  process.exit(0)
})

startServer()
