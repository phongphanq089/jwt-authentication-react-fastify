import { z } from 'zod'

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(12, 'Token must be at least 10 characters'),
  userId: z.string().min(1, 'User ID is required'),
  createdAt: z.date().default(() => new Date()),
})

export type RefreshToken = z.infer<typeof refreshTokenSchema>
