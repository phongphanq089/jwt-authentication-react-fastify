import { MESSAGES } from '@/contants/message'
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
import { UserService } from '@/services/user.service'
import { pickUser } from '@/utils/pickUser'
import { sendResponse } from '@/utils/response'
import { FastifyReply, FastifyRequest } from 'fastify'
import { RouteGenericInterface } from 'fastify/types/route'
import ms from 'ms'

interface RegisterUserRoute extends RouteGenericInterface {
  Body: UserRegisterSchemaType
}

export const registerUserController = async (
  request: FastifyRequest<RegisterUserRoute>,
  reply: FastifyReply
) => {
  const result = await UserService.register(request.body)

  return sendResponse(reply, MESSAGES.REGISTER_SUCCESS, pickUser(result))
}

interface LoginUserRoute extends RouteGenericInterface {
  Body: UserLoginSchemaType
}
export const loginUserController = async (
  request: FastifyRequest<LoginUserRoute>,
  reply: FastifyReply
) => {
  const result = await UserService.login(request.body)

  reply.setCookie('accessToken', result.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: ms('14 days'),
  })

  reply.setCookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: ms('14 days'),
  })

  return sendResponse(reply, MESSAGES.LOGIN_SUCCESS, result)
}

export const logOutController = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const result = await UserService.logout(req?.cookies.refreshToken as string)

  reply.clearCookie('accessToken')
  reply.clearCookie('refreshToken')
  return sendResponse(reply, result.message)
}

interface VerifyAccountUserRoute extends RouteGenericInterface {
  Body: VerifyAccountSchemaType
}

export const verifyAccountController = async (
  request: FastifyRequest<VerifyAccountUserRoute>,
  reply: FastifyReply
) => {
  const result = await UserService.verifyAccount(request.body)

  return sendResponse(reply, MESSAGES.VERIFY_SUCCESS, pickUser(result))
}

interface ResenVerifyTypeUserRoute extends RouteGenericInterface {
  Body: ResenVerifyType
}

export const resendVerifyController = async (
  request: FastifyRequest<ResenVerifyTypeUserRoute>,
  reply: FastifyReply
) => {
  const result = await UserService.resendVerifyCode(request.body)

  return sendResponse(reply, result.message)
}

interface ForgotPasswordTypeUserRoute extends RouteGenericInterface {
  Body: ForgotPasswordType
}

export const forgotPasswordController = async (
  request: FastifyRequest<ForgotPasswordTypeUserRoute>,
  reply: FastifyReply
) => {
  const result = await UserService.forgotPassword(request.body)

  return sendResponse(reply, result.message)
}

interface UpdatePasswordTypeUserRoute extends RouteGenericInterface {
  Body: UpdatePasswordType
}

export const updatePasswordController = async (
  request: FastifyRequest<UpdatePasswordTypeUserRoute>,
  reply: FastifyReply
) => {
  const result = await UserService.updatePassword(request.body)

  return sendResponse(reply, result.message)
}

interface resenVerifyUpdatePasswordTypeUserRoute extends RouteGenericInterface {
  Body: ResenVerifyUpdatePasswordType
}

export const resendVerifyUpdatePasswordController = async (
  request: FastifyRequest<resenVerifyUpdatePasswordTypeUserRoute>,
  reply: FastifyReply
) => {
  const result = await UserService.resendVerifyUpdatePassword(request.body)

  return sendResponse(reply, result.message)
}

export const refreshTokenController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const result = await UserService.refreshToken(
    request.cookies?.refreshToken as string
  )

  reply.cookie('accessToken', result.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: ms('14 days'),
  })
  return sendResponse(reply, result.accessToken)
}

export const getProfileController = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const userId = (req.user as { _id: string })._id

  const user = await UserService.getProfile(userId)

  return sendResponse(reply, 'GET PROFILE SUCCESS', pickUser(user))
}

interface updateProfileTypeRoute extends RouteGenericInterface {
  Body: UpdateProfileType
}

export const updateProfileController = async (
  request: FastifyRequest<updateProfileTypeRoute>,
  reply: FastifyReply
) => {
  const userId = (request.user as { _id: string })._id

  const updatedUser = await UserService.updateProfile(userId, request.body)

  return sendResponse(reply, 'UPDATE PROFILE SUCCESS', pickUser(updatedUser))
}

interface changePasswordTypeRoute extends RouteGenericInterface {
  Body: ChangePasswordType
}

export const changePasswordController = async (
  request: FastifyRequest<changePasswordTypeRoute>,
  reply: FastifyReply
) => {
  const userId = (request.user as { _id: string })._id

  const result = await UserService.changePassword(userId, request.body)

  return sendResponse(reply, 'Update Password success', result)
}

interface changeEmailTypeTypeRoute extends RouteGenericInterface {
  Body: ChangeEmailType
}

export const changeEmailController = async (
  request: FastifyRequest<changeEmailTypeTypeRoute>,
  reply: FastifyReply
) => {
  const userId = (request.user as { _id: string })._id
  const result = await UserService.changeEmail(userId, request.body)

  return sendResponse(reply, 'Send Email success', result)
}

interface confirmEmailTypeTypeRoute extends RouteGenericInterface {
  Body: {
    email: string
    token: string
  }
}

export const ConfirmEmailController = async (
  request: FastifyRequest<confirmEmailTypeTypeRoute>,
  reply: FastifyReply
) => {
  const result = await UserService.confirmChangeEmail(
    request.body.email,
    request.body.token
  )

  return sendResponse(reply, 'Update Email success', result)
}
