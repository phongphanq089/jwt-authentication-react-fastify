import Datastore from 'nedb-promises'
import path from 'path'
import fs from 'fs'
import { RefreshToken } from '@/schemas/refreshToken.schema'
import { UserRegisterSchemaType } from '@/schemas/user.schema'

class Database {
  public users: Datastore<UserRegisterSchemaType>
  public refreshTokens: Datastore<RefreshToken>
  constructor() {
    const dataDir = path.join(process.cwd(), 'data-fake')

    // Ensure data directory exists
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }

    this.users = Datastore.create({
      filename: path.join(dataDir, 'users.db'),
      autoload: true,
    })

    this.refreshTokens = Datastore.create({
      filename: path.join(dataDir, 'refreshTokens.db'),
      autoload: true,
    })

    this.createIndexes()
  }
  private async createIndexes(): Promise<void> {
    try {
      await this.users.ensureIndex({ fieldName: 'email', unique: true })
      await this.users.ensureIndex({ fieldName: 'username', unique: true })
      await this.users.ensureIndex({ fieldName: 'role' })
      await this.refreshTokens.ensureIndex({
        fieldName: 'refreshToken',
        unique: true,
      })
    } catch (error) {
      console.error('Error creating indexes:', error)
    }
  }
  async initializeData(): Promise<void> {
    try {
      console.log('✅ Database initialized successfully')
    } catch (error) {
      console.error('❌ Error initializing database:', error)
      throw error
    }
  }
}

export const database = new Database()
