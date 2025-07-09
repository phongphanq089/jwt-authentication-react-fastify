import { ENV_CONFIG } from '@/config/envConfig'
import { jwtProvider } from '@/provider/jwtProvider'
import { AppError, UnauthorizedError } from '@/utils/errors'
import { FastifyReply, FastifyRequest } from 'fastify'

// Extend the Request interface to include jwtDecoded

// middleware này sẽ đảm nhận việc quan trọng : xác thực cái jwt access nhận được từ FE có hợp lệ hay ko
export const authMiddlewares = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const clientAccessToken =
    request.cookies?.accessToken ||
    request.headers.authorization?.replace('Bearer ', '')

  if (!clientAccessToken) {
    throw new UnauthorizedError('Unauthorized (access token not found)')
  }

  try {
    const decoded = await jwtProvider.verifyToken(
      clientAccessToken,
      ENV_CONFIG.ACCESS_TOKEN_SECRET_SIGNATURE
    )

    // Lưu user đã giải mã vào request.user (giống như req.jwtDecoded trong Express)
    request.user = decoded
  } catch (error: any) {
    if (error?.message?.includes('jwt expired')) {
      throw new AppError('Access token expired', 410) // HTTP 410: Gone
    }
    throw new UnauthorizedError('Invalid access token') // HTTP 401
  }
}
