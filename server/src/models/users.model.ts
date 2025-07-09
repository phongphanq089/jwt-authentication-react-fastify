import { database } from '@/config/dbFakeConfig'
import { refreshTokenSchema } from '@/schemas/refreshToken.schema'
import { UserRegisterSchemaType } from '@/schemas/user.schema'
import { AppError } from '@/utils/errors'

export class UserModel {
  static async findByEmailOrUsername(email: string, username: string) {
    return await database.users.findOne({
      $or: [{ email }, { username }],
    })
  }

  static async checkExitEmail(email: string) {
    return await database.users.findOne({ email })
  }

  static async insert(data: Omit<UserRegisterSchemaType, '_id'>) {
    return await database.users.insert(data)
  }

  static async createRefreshToken(token: string, userId: string) {
    // Xóa các token cũ trước
    await database.refreshTokens.remove({ userId }, { multi: true })

    const parsed = refreshTokenSchema.safeParse({
      refreshToken: token,
      userId,
      createdAt: new Date(),
    })

    if (!parsed.success) {
      throw new Error(
        'Invalid refresh token payload: ' +
          JSON.stringify(parsed.error.format())
      )
    }

    return await database.refreshTokens.insert(parsed.data)
  }

  static async verifyRefreshToken(token: string) {
    const tokenData = await database.refreshTokens.findOne({
      refreshToken: token,
    })
    if (!tokenData) {
      throw new AppError('Refresh token not found or invalid')
    }
    return tokenData
  }

  static async removeRefreshToken(token: string) {
    return await database.refreshTokens.remove(
      { refreshToken: token },
      { multi: false }
    )
  }

  static async updateUserVerifyStatus(
    userId: string,
    updateData: Partial<
      Pick<
        UserRegisterSchemaType,
        'isActive' | 'verify_token' | 'verify_token_expired_at'
      >
    >
  ) {
    const updatePayload = {
      ...updateData,
      updatedAt: new Date(),
    }

    // NeDB không hỗ trợ `{ returnUpdatedDocs: true }` giống MongoDB, nên cần gọi find lại
    await database.users.update({ _id: userId }, { $set: updatePayload })

    // Lấy lại bản ghi sau khi cập nhật
    const updatedUser = await database.users.findOne({ _id: userId })
    return updatedUser
  }

  static async updateUserForgotPassword(
    userId: string,
    updateData: Partial<
      Pick<
        UserRegisterSchemaType,
        | 'password'
        | 'forgot_password_token'
        | 'forgot_password_token_expired_at'
      >
    >
  ) {
    await database.users.update(
      { _id: userId },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      }
    )

    return await database.users.findOne({ _id: userId })
  }

  static async findUserById(userId: string) {
    const user = await database.users.findOne({ _id: userId })

    return user
  }
}
