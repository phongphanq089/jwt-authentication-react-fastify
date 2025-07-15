import { z } from 'zod'

const allowedDomains = ['example.com', 'sub.example.com', 'localhost:5173']

// ==== kiểm tra danh sách các host có được cho phép gửi lên hay ko
const redirectUrlSchema = z
  .string()
  .url({ message: 'urlRedirect must be a valid URL' })
  .refine(
    (url) => {
      try {
        const parsed = new URL(url)
        const host = parsed.host
        return allowedDomains.includes(host)
      } catch {
        return false
      }
    },
    {
      message: 'urlRedirect must be from an allowed domain or localhost:5173',
    }
  )

export class userSchema {
  public static userRegisterSchema = z.object({
    _id: z.string().optional(),

    username: z
      .string()
      .min(3, 'Username must be at least 3 characters long')
      .max(30, 'Username cannot exceed 30 characters'),

    email: z.string().email('Please enter valid email address'),
    temp_email: z.string().email().nullable().optional().default(null),

    avatar: z
      .string()
      .url({ message: 'Avatar must be a valid URL.' })
      .nullable()
      .optional()
      .default(null),

    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .refine((password) => /[0-9!@#$%^&*(),.?":{}|<>]/.test(password), {
        message:
          'Password must include at least one number or special character',
      }),

    role: z
      .enum(['admin', 'client'], {
        message: `'Role must be either "admin" or "client".'`,
      })
      .nullable()
      .optional()
      .default('client'),

    isActive: z.boolean().nullable().optional().default(false),
    verify_token: z.string().nullable().optional().default(null),
    verify_token_expired_at: z.number().nullable().optional().default(null),
    forgot_password_token: z.string().nullable().optional().default(null),
    forgot_password_token_expired_at: z
      .number()
      .nullable()
      .optional()
      .default(null),
    metadata: z.record(z.any()).optional(),
    createdAt: z
      .union([z.string(), z.date()])
      .transform((val) => new Date(val))
      .optional(),
    updatedAt: z
      .union([z.string(), z.date()])
      .transform((val) => new Date(val))
      .optional(),
    lastLogin: z
      .union([z.string(), z.date()])
      .transform((val) => (val ? new Date(val) : undefined))
      .optional(),
    urlRedirect: redirectUrlSchema,
  })
  public static userLoginSchema = z.object({
    email: z.string().email({
      message: 'Please enter valid email address',
    }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .refine((password) => /[0-9!@#$%^&*(),.?":{}|<>]/.test(password), {
        message:
          'Password must include at least one number or special character',
      }),
  })

  public static verifyAccount = z.object({
    email: z.string().email({
      message: 'Please enter valid email address',
    }),
    token: z.string().nullable().optional().default(null),
  })
  public static resenVerify = z.object({
    email: z.string().email({
      message: 'Please enter valid email address',
    }),
    urlRedirect: redirectUrlSchema,
  })
  public static forgotPassword = z.object({
    email: z.string().email({
      message: 'Please enter valid email address',
    }),
    urlRedirect: redirectUrlSchema,
  })
  public static updatePassword = z.object({
    email: z.string().email({
      message: 'Please enter valid email address',
    }),
    token: z.string().nullable().optional().default(null),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .refine((password) => /[0-9!@#$%^&*(),.?":{}|<>]/.test(password), {
        message:
          'Password must include at least one number or special character',
      }),
  })
  public static resenVerifyUpdatePassword = z.object({
    email: z.string().email({
      message: 'Please enter valid email address',
    }),
    urlRedirect: redirectUrlSchema,
  })
  public static updateProfileSchema = z.object({
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(30, 'Username cannot exceed 30 characters')
      .optional(),
    avatar: z
      .string()
      .url({ message: 'Avatar must be a valid URL' })
      .nullable()
      .optional(),
  })

  public static changePasswordSchema = z.object({
    oldPassword: z.string().min(8, 'Old password is required'),
    newPassword: z
      .string()
      .min(8, 'New password must be at least 8 characters')
      .refine((val) => /[0-9!@#$%^&*]/.test(val), {
        message:
          'New password must contain at least one number or special character',
      }),
  })
  public static changeEmailSchema = z.object({
    newEmail: z.string().email('New email must be valid'),
    urlRedirect: z.string().url(),
  })
}

export type UserRegisterSchemaType = z.infer<
  typeof userSchema.userRegisterSchema
>
export type UserLoginSchemaType = z.infer<typeof userSchema.userLoginSchema>

export type VerifyAccountSchemaType = z.infer<typeof userSchema.verifyAccount>

export type ResenVerifyType = z.infer<typeof userSchema.resenVerify>

export type ForgotPasswordType = z.infer<typeof userSchema.forgotPassword>

export type UpdatePasswordType = z.infer<typeof userSchema.updatePassword>

export type ResenVerifyUpdatePasswordType = z.infer<
  typeof userSchema.resenVerifyUpdatePassword
>

export type UpdateProfileType = z.infer<typeof userSchema.updateProfileSchema>

export type ChangePasswordType = z.infer<typeof userSchema.changePasswordSchema>

export type ChangeEmailType = z.infer<typeof userSchema.changeEmailSchema>
