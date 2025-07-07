import { MESSAGES } from '@/contants/message'
import {
  ForgotPasswordType,
  ResenVerifyType,
  ResenVerifyUpdatePasswordType,
  UpdatePasswordType,
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

interface LoginUserRoute extends RouteGenericInterface {
  Body: UserLoginSchemaType
}

interface VerifyAccountUserRoute extends RouteGenericInterface {
  Body: VerifyAccountSchemaType
}

interface ResenVerifyTypeUserRoute extends RouteGenericInterface {
  Body: ResenVerifyType
}

interface ForgotPasswordTypeUserRoute extends RouteGenericInterface {
  Body: ForgotPasswordType
}

interface UpdatePasswordTypeUserRoute extends RouteGenericInterface {
  Body: UpdatePasswordType
}

interface resenVerifyUpdatePasswordTypeUserRoute extends RouteGenericInterface {
  Body: ResenVerifyUpdatePasswordType
}

export const registerUserController = async (
  request: FastifyRequest<RegisterUserRoute>,
  reply: FastifyReply
) => {
  const result = await UserService.register(request.body)

  return sendResponse(reply, MESSAGES.REGISTER_SUCCESS, pickUser(result))
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

export const verifyAccountController = async (
  request: FastifyRequest<VerifyAccountUserRoute>,
  reply: FastifyReply
) => {
  const result = await UserService.verifyAccount(request.body)

  return sendResponse(reply, MESSAGES.VERIFY_SUCCESS, pickUser(result))
}

export const resendVerifyController = async (
  request: FastifyRequest<ResenVerifyTypeUserRoute>,
  reply: FastifyReply
) => {
  const result = await UserService.resendVerifyCode(request.body)

  return sendResponse(reply, result.message)
}

export const forgotPasswordController = async (
  request: FastifyRequest<ForgotPasswordTypeUserRoute>,
  reply: FastifyReply
) => {
  const result = await UserService.forgotPassword(request.body)

  return sendResponse(reply, result.message)
}

export const updatePasswordController = async (
  request: FastifyRequest<UpdatePasswordTypeUserRoute>,
  reply: FastifyReply
) => {
  const result = await UserService.updatePassword(request.body)

  return sendResponse(reply, result.message)
}

export const resendVerifyUpdatePasswordController = async (
  request: FastifyRequest<resenVerifyUpdatePasswordTypeUserRoute>,
  reply: FastifyReply
) => {
  const result = await UserService.resendVerifyUpdatePassword(request.body)

  return sendResponse(reply, result.message)
}
