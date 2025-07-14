import {
  changeEmailController,
  changePasswordController,
  forgotPasswordController,
  getProfileController,
  loginUserController,
  logOutController,
  refreshTokenController,
  registerUserController,
  resendVerifyController,
  resendVerifyUpdatePasswordController,
  updatePasswordController,
  updateProfileController,
  verifyAccountController,
} from '@/controller/auth.controller'
import { authMiddlewares } from '@/middleware/authMiddlewares'
import { zodValidate } from '@/middleware/zodValidate'
import { userSchema } from '@/schemas/user.schema'
import { withErrorHandling } from '@/utils/withErrorHandling'
import { FastifyInstance } from 'fastify'

export const authRoute = (server: FastifyInstance) => {
  server.post(
    '/register',
    {
      preHandler: zodValidate(userSchema.userRegisterSchema),
    },
    withErrorHandling(registerUserController)
  ),
    server.post(
      '/login',
      {
        preHandler: zodValidate(userSchema.userLoginSchema),
      },
      withErrorHandling(loginUserController)
    )
  server.post(
    '/verifyAccount',
    {
      preHandler: zodValidate(userSchema.verifyAccount),
    },
    withErrorHandling(verifyAccountController)
  ),
    server.post(
      '/resend_verifyAccount',
      {
        preHandler: zodValidate(userSchema.resenVerify),
      },
      withErrorHandling(resendVerifyController)
    ),
    server.post(
      '/forgot-password',
      {
        preHandler: zodValidate(userSchema.forgotPassword),
      },
      withErrorHandling(forgotPasswordController)
    ),
    server.post(
      '/update-password',
      {
        preHandler: zodValidate(userSchema.updatePassword),
      },
      withErrorHandling(updatePasswordController)
    ),
    server.post(
      '/resend-update-password',
      {
        preHandler: zodValidate(userSchema.resenVerifyUpdatePassword),
      },
      withErrorHandling(resendVerifyUpdatePasswordController)
    ),
    server.post('/refreshToken', withErrorHandling(refreshTokenController)),
    server.post('/logout', withErrorHandling(logOutController))
  server.get(
    '/getProfile',
    {
      preHandler: authMiddlewares,
    },
    withErrorHandling(getProfileController)
  ),
    server.put(
      '/updateProfile',
      {
        preHandler: authMiddlewares,
      },
      withErrorHandling(updateProfileController)
    ),
    server.put(
      '/change-password',
      {
        preHandler: authMiddlewares,
      },
      withErrorHandling(changePasswordController)
    )
  server.put(
    '/change-email',
    {
      preHandler: [authMiddlewares],
    },
    withErrorHandling(changeEmailController)
  ),
    server.post(
      '/confirm-change-email',
      {
        preHandler: [authMiddlewares],
      },
      withErrorHandling(changeEmailController)
    )
}
