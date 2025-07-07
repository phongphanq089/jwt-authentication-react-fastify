import {
  forgotPasswordController,
  loginUserController,
  registerUserController,
  resendVerifyController,
  resendVerifyUpdatePasswordController,
  updatePasswordController,
  verifyAccountController,
} from '@/controller/auth.controller'
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
    )
}
