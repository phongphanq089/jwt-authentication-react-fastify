import { ENV_CONFIG } from '@/config/envConfig'
import { INFOMAITON } from '@/contants/infomation'
import { BrevoEmailProvider } from '@/provider/brevoEmailProvider'
import {
  ChangeEmailType,
  ChangePasswordType,
  ForgotPasswordType,
  ResenVerifyType,
  ResenVerifyUpdatePasswordType,
  UpdatePasswordType,
  UpdateProfileType,
  UserLoginSchemaType,
  UserRegisterSchemaType,
  VerifyAccountSchemaType,
} from '@/schemas/user.schema'

import {
  AppError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from '@/utils/errors'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'
import { UserModel } from '@/models/users.model'
import { jwtProvider } from '@/provider/jwtProvider'
import { pickUser } from '@/utils/pickUser'
import { expiresAtToken } from '@/utils/utils'
import { database } from '@/config/dbFakeConfig'

export class UserService {
  /**
   * @REGISTER
   * @SCHEMA userRegisterSchemaType
   * @returns
   */
  static async register(
    userData: UserRegisterSchemaType
  ): Promise<UserRegisterSchemaType> {
    const { username, email, password, urlRedirect } = userData

    const existingUser = await UserModel.findByEmailOrUsername(email, username)
    if (existingUser) {
      const isEmailConflict = existingUser.email === email
      const isUsernameConflict = existingUser.username === username
      let message =
        isEmailConflict && isUsernameConflict
          ? 'Email and username already exist'
          : isEmailConflict
          ? 'Email already exists'
          : 'Username already exists'
      throw new ConflictError(message)
    }

    const hashedPassword = await bcrypt.hash(
      password,
      +ENV_CONFIG.BCRYPT_ROUNDS || 12
    )

    const user: Omit<UserRegisterSchemaType, '_id'> = {
      username,
      email,
      temp_email: null,
      password: hashedPassword,
      role: 'client',
      avatar: null,
      isActive: false,
      metadata: {},
      createdAt: new Date(),
      updatedAt: new Date(),
      verify_token: uuidv4(),
      verify_token_expired_at: expiresAtToken,
      forgot_password_token: null,
      forgot_password_token_expired_at: null,
      urlRedirect: urlRedirect,
    }

    let newUser

    // ======= hiện tại các chỗ khác mình đang gọi   await BrevoEmailProvider chứ ko try catch  như này , có thể bổ xung thêm để trường hợp mail server lỗi nhưng nó ko trả về lỗi mà nó pass qua luôn
    // ======   currently the other pages I'm calling are waiting for BrevoEmailProvider and not trying to catch like this, could add around the mail server error case but it doesn't return an error it always passes
    try {
      newUser = await UserModel.insert(user)
      await BrevoEmailProvider.sendMail(
        newUser.email,
        'Verify your email',
        {
          logoUrl: INFOMAITON.LOGO_TEMPLATE_HTML_EMAIL,
          name: INFOMAITON.USER_DEFAULT_NAME,
          companyName: INFOMAITON.DEFAULT_NAME_PROJECT,
          verifyLink: `${urlRedirect}?email=${user.email}&token=${newUser.verify_token}`,
          year: `${new Date().getFullYear()}`,
        },
        'src/templates/template-mail.html'
      )
    } catch (error) {
      throw new AppError(`SERVER ERROR : ${error}`, 500)
    }
    return newUser
  }
  /**
   * @LOGIN
   * @SCHEMA UserLoginSchemaType
   * @returns
   */
  static async login(userData: UserLoginSchemaType): Promise<{
    accessToken: string
    refreshToken: string
  }> {
    const { email } = userData
    const existUser = await UserModel.checkExitEmail(email)

    if (!existUser) {
      throw new NotFoundError('Account not found')
    }

    if (!existUser.isActive) {
      throw new ForbiddenError('Your account is not verified')
    }

    if (!bcrypt.compareSync(userData.password, existUser.password)) {
      throw new UnauthorizedError('Your email or password is incorrect !')
    }
    const userInfo = { _id: existUser._id, email: existUser.email }

    const accessToken = await jwtProvider.generateToken({
      payload: userInfo,
      options: {
        expiresIn: ENV_CONFIG.ACCESS_TOKEN_LIFE,
      },
      secretOrPrivateKey: ENV_CONFIG.ACCESS_TOKEN_SECRET_SIGNATURE,
    })

    const refreshToken = await jwtProvider.generateToken({
      payload: userInfo,
      options: {
        expiresIn: ENV_CONFIG.REFRESH_TOKEN_LIFE,
      },
      secretOrPrivateKey: ENV_CONFIG.REFRESH_TOKEN_SECRET_SIGNATURE,
    })

    await UserModel.createRefreshToken(refreshToken, existUser._id as string)

    const result = {
      accessToken,
      refreshToken,
      ...pickUser(existUser),
    }
    return result
  }
  /**
   * @LOGOUT
   * @returns
   */
  static async logout(clientRefreshToken: string) {
    const storedToken = await UserModel.verifyRefreshToken(clientRefreshToken)

    if (!storedToken) {
      throw new UnauthorizedError('Invalid or expired refresh token')
    }

    await UserModel.removeRefreshToken(clientRefreshToken)

    return { message: 'Logout successful' }
  }
  /**
   * @VERIFY_ACCOUNT
   * @SCHEMA VerifyAccountSchemaType
   * @returns
   */
  static async verifyAccount(userData: VerifyAccountSchemaType) {
    const existUser = await UserModel.checkExitEmail(userData.email)
    if (!existUser) {
      throw new NotFoundError('Account not found')
    }

    if (existUser.isActive) {
      return pickUser(existUser)
    }

    if (userData.token !== existUser.verify_token) {
      throw new ForbiddenError('Token is invalid!')
    }

    if (
      !existUser.verify_token_expired_at ||
      existUser.verify_token_expired_at < Date.now()
    ) {
      throw new ForbiddenError('Token has expired!')
    }

    const newResult = await UserModel.updateUserVerifyStatus(
      existUser._id as string,
      {
        isActive: true,
        verify_token: null,
        verify_token_expired_at: null,
      }
    )

    return pickUser(newResult)
  }
  /**
   * @RESEND_VERIFY_CODE
   * @SCHEMA ResenVerifyType
   * @returns
   */
  static async resendVerifyCode(resBody: ResenVerifyType) {
    const existUser = await UserModel.checkExitEmail(resBody.email)
    if (!existUser) {
      throw new NotFoundError('Account not found')
    }

    if (existUser.isActive) {
      throw new ForbiddenError('Your account is already active!')
    }

    const newVerifyToken = uuidv4()
    const newVerifyTokenExpiredAt = expiresAtToken

    const updatedUser = await UserModel.updateUserVerifyStatus(
      existUser._id as string,
      {
        verify_token: newVerifyToken,
        verify_token_expired_at: newVerifyTokenExpiredAt,
      }
    )

    await BrevoEmailProvider.sendMail(
      resBody.email,
      'Verify your email',
      {
        logoUrl: INFOMAITON.LOGO_TEMPLATE_HTML_EMAIL,
        name: INFOMAITON.USER_DEFAULT_NAME,
        companyName: INFOMAITON.DEFAULT_NAME_PROJECT,
        verifyLink: `${resBody.urlRedirect}?email=${resBody.email}&token=${updatedUser?.verify_token}`,
        year: `${new Date().getFullYear()}`,
      },
      'src/templates/template-mail.html'
    )

    return {
      message: 'Verification email has been resent.',
    }
  }

  /**
   * @FORGOT_PASSWORD
   * @SCHEMA ForgotPasswordType
   * @returns
   */
  static async forgotPassword(resBody: ForgotPasswordType) {
    const existUser = await UserModel.checkExitEmail(resBody.email)
    if (!existUser) {
      throw new NotFoundError('Account not found')
    }

    const VerifyToken = uuidv4()

    const updatedUser = await UserModel.updateUserForgotPassword(
      existUser._id as string,
      {
        forgot_password_token: VerifyToken,
        forgot_password_token_expired_at: expiresAtToken,
      }
    )

    const resetLink = `${resBody.urlRedirect}?email=${updatedUser?.email}&token=${VerifyToken}`

    if (!updatedUser?.email) {
      throw new Error(
        'User email is missing when sending reset password email.'
      )
    }

    await BrevoEmailProvider.sendMail(
      updatedUser.email,
      'Reset your password',
      {
        logoUrl: INFOMAITON.LOGO_TEMPLATE_HTML_EMAIL,
        name: INFOMAITON.USER_DEFAULT_NAME,
        companyName: INFOMAITON.DEFAULT_NAME_PROJECT,
        verifyLink: resetLink,
        year: `${new Date().getFullYear()}`,
      },
      'src/templates/forgot-password.html'
    )

    return {
      message: `Reset password email has been sent to ${resBody.email} .`,
    }
  }
  /**
   * @UPDATE_PASSWORD
   * @SCHEMA VerifyUpdatePasswordType
   * @returns
   */
  static async updatePassword(resBody: UpdatePasswordType) {
    const existUser = await UserModel.checkExitEmail(resBody.email)
    if (!existUser) {
      throw new NotFoundError('Account not found')
    }

    if (resBody.token !== existUser.forgot_password_token) {
      throw new ForbiddenError('Token is invalid!')
    }

    if (
      !existUser.forgot_password_token_expired_at ||
      existUser.forgot_password_token_expired_at < Date.now()
    ) {
      throw new ForbiddenError('Token has expired!')
    }

    const hashedPassword = await bcrypt.hash(
      resBody.password,
      +ENV_CONFIG.BCRYPT_ROUNDS || 12
    )

    await UserModel.updateUserForgotPassword(existUser._id as string, {
      password: hashedPassword,
      forgot_password_token: null,
    })

    return {
      message: 'Update password success',
    }
  }
  /**
   * @RESEND_VERIFY_UPDATE_PASSWORD
   * @SCHEMA VerifyUpdatePasswordType
   * @returns
   */
  static async resendVerifyUpdatePassword(
    resBody: ResenVerifyUpdatePasswordType
  ) {
    const existUser = await UserModel.checkExitEmail(resBody.email)
    if (!existUser) {
      throw new NotFoundError('Account not found')
    }

    const newVerifyToken = uuidv4()
    const newVerifyTokenExpiredAt = expiresAtToken

    const updatedUser = await UserModel.updateUserForgotPassword(
      existUser._id as string,
      {
        forgot_password_token: newVerifyToken,
        forgot_password_token_expired_at: newVerifyTokenExpiredAt,
      }
    )

    if (!updatedUser?.email) {
      throw new Error(
        'User email is missing when sending reset password email.'
      )
    }

    const resetLink = `${resBody.urlRedirect}?email=${updatedUser?.email}&token=${newVerifyToken}`

    await BrevoEmailProvider.sendMail(
      updatedUser.email,
      'Reset your password',
      {
        logoUrl: INFOMAITON.LOGO_TEMPLATE_HTML_EMAIL,
        name: INFOMAITON.USER_DEFAULT_NAME,
        companyName: INFOMAITON.DEFAULT_NAME_PROJECT,
        verifyLink: resetLink,
        year: `${new Date().getFullYear()}`,
      },
      'src/templates/forgot-password.html'
    )

    return {
      message: 'Reset password email has been sent.',
    }
  }
  /**
   * @REFRESH_TOKEN
   * @SCHEMA VerifyUpdatePasswordType
   * @returns
   */
  static async refreshToken(clientRefreshToken: string) {
    // === hàm này có chức năng tạo mới accessToken khi hết hạn
    try {
      // 1. Kiểm tra token có trong DB không
      const storedToken = await UserModel.verifyRefreshToken(clientRefreshToken)

      if (!storedToken) {
        throw new UnauthorizedError('Invalid refresh token in DB')
      }

      // giải mã xem có hợp lệ hay ko , nếu token hết hạn thì jwt tự động trả lỗi sẽ chạy vào catch error
      const refreshTokenDecoded = await jwtProvider.verifyToken(
        clientRefreshToken,
        ENV_CONFIG.REFRESH_TOKEN_SECRET_SIGNATURE
      )

      const userInfo = {
        _id: refreshTokenDecoded._id,
        email: refreshTokenDecoded.email,
      }

      const accessToken = await jwtProvider.generateToken({
        payload: userInfo,
        options: {
          expiresIn: ENV_CONFIG.ACCESS_TOKEN_LIFE,
        },
        secretOrPrivateKey: ENV_CONFIG.ACCESS_TOKEN_SECRET_SIGNATURE,
      })

      return { accessToken }
    } catch (error: any) {
      // kiểm tra nếu lỗi token hết hạn thì cho vào trong này
      if (error?.message?.includes('jwt expired')) {
        throw new UnauthorizedError('Refresh token expired')
      }

      // ngược lại nếu ko phải lỗi token lỗi khác thì ném vào đây
      throw new UnauthorizedError(
        'Please sign in! ( error from refresh token )'
      )
    }
  }
  /**
   * @GET_USER_PROFILE
   * @returns
   */
  static async getProfile(userId: string) {
    const user = await UserModel.findUserById(userId)

    if (!user) {
      throw new NotFoundError('User not found')
    }

    return user
  }
  /**
   * @UPDATE_PROFILE
   * @returns
   */
  static async updateProfile(userId: string, data: Partial<UpdateProfileType>) {
    const user = await UserModel.findUserById(userId)

    if (!user) {
      throw new Error('User not found')
    }

    const updatedUser = await UserModel.updateUserProfile(
      userId,
      data as Partial<Pick<UserRegisterSchemaType, 'username' | 'avatar'>>
    )

    return updatedUser
  }
  /**
   * @CHANGE_PASSWORD
   * @returns
   */
  static async changePassword(userId: string, data: ChangePasswordType) {
    const user = await UserModel.findUserById(userId)
    if (!user) throw new NotFoundError('User not found')

    const isMatch = await bcrypt.compare(data.oldPassword, user.password)
    if (!isMatch) throw new UnauthorizedError('Old password is incorrect')

    const hashedNewPassword = await bcrypt.hash(data.newPassword, 12)

    await UserModel.updateUserForgotPassword(userId, {
      password: hashedNewPassword,
    })

    return { message: 'Password updated successfully' }
  }
  /**
   * @CHANGE_EMAIL
   * @return
   */
  static async changeEmail(userId: string, data: ChangeEmailType) {
    const user = await UserModel.findUserById(userId)
    if (!user) throw new NotFoundError('User not found')

    const isTaken = await UserModel.checkExitEmail(data.newEmail)
    if (isTaken) throw new ConflictError('Email already in use')

    const verifyToken = uuidv4()
    const tokenExpiry = Date.now() + 15 * 60 * 1000

    await UserModel.updateUserVerifyStatus(userId, {
      verify_token: verifyToken,
      verify_token_expired_at: tokenExpiry,
      temp_email: data.newEmail,
    })

    await BrevoEmailProvider.sendMail(
      data.newEmail,
      'Verify your new email address',
      {
        logoUrl: INFOMAITON.LOGO_TEMPLATE_HTML_EMAIL,
        name: INFOMAITON.USER_DEFAULT_NAME,
        companyName: INFOMAITON.DEFAULT_NAME_PROJECT,
        verifyLink: `${data.urlRedirect}?email=${data.newEmail}&token=${verifyToken}`,
        year: `${new Date().getFullYear()}`,
      },
      'src/templates/template-mail.html'
    )

    return { message: 'Please verify your new email address via email link.' }
  }
  static async confirmChangeEmail(email: string, token: string) {
    // hiện tại đang  dùng nedb-promises fake  nên ko thể query kiểu callback được nên bắt buộc phải check kiểu này
    // Bước 1: Tìm user theo token
    let user = await database.users.findOne({ verify_token: token })

    // ✅ Nếu tìm thấy user theo token
    if (user) {
      if (user.verify_token !== token) throw new ForbiddenError('Invalid token')
      if (Date.now() > (user.verify_token_expired_at || 0)) {
        throw new ForbiddenError('Token expired')
      }

      // Cập nhật email
      const updated = await UserModel.updateUserVerifyStatus(
        user._id as string,
        {
          email: user.temp_email as string,
          temp_email: null,
          verify_token: null,
          verify_token_expired_at: null,
        }
      )

      return pickUser(updated)
    }

    // ❗ Bước 2: Nếu token không còn (người dùng đã xác nhận rồi)
    // → Thử tìm theo email để biết có phải đã xác thực rồi không
    user = await database.users.findOne({ email })

    if (user && !user.verify_token && !user.temp_email) {
      // ✅ Đã xác nhận trước đó → idempotent OK
      return pickUser(user)
    }

    // ❌ Nếu không tìm thấy, báo lỗi
    throw new NotFoundError('User not found or already verified')
  }
}
