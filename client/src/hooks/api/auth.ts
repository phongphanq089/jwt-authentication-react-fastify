import { useMutation, useQuery } from '@tanstack/react-query'
import https from '~/lib/https'
import type {
  ChangeEmailType,
  ChangePasswordType,
  ForgotPasswordType,
  ResenVerifyType,
  UpdatePasswordType,
  UserLoginSchemaType,
  UserRegisterSchemaType,
  VerifyAccountSchemaType,
  VerifyConfirmNewEmailType,
} from '~/validate/authentication'

export const useLogin = () => {
  return useMutation({
    mutationFn: async (payload: UserLoginSchemaType) => {
      const res = await https.post('/login', payload)
      return res.data
    },
  })
}

export const useRegister = () => {
  return useMutation({
    mutationFn: async (payload: UserRegisterSchemaType) => {
      const res = await https.post('/register', payload)
      return res.data
    },
  })
}

export const useVerifyAccount = () => {
  return useMutation({
    mutationFn: async (payload: VerifyAccountSchemaType) => {
      const res = await https.post('/verifyAccount', payload)
      return res.data
    },
  })
}
export const useResendVerifyAccount = () => {
  return useMutation({
    mutationFn: async (payload: ResenVerifyType) => {
      const res = await https.post('/resend_verifyAccount', payload)
      return res.data
    },
  })
}

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (payload: ForgotPasswordType) => {
      const res = await https.post('/forgot-password', payload)
      return res.data
    },
  })
}

export const useUpdateForgotPassword = () => {
  return useMutation({
    mutationFn: async (payload: UpdatePasswordType) => {
      const res = await https.post('/update-password', payload)
      return res.data
    },
  })
}

export const useResendForgotPassword = () => {
  return useMutation({
    mutationFn: async (payload: ResenVerifyType) => {
      const res = await https.post('/resend-update-password', payload)
      return res.data
    },
  })
}

export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (payload: ChangePasswordType) => {
      const res = await https.put('/change-password', payload)
      return res.data
    },
  })
}

export const useChangeEmail = () => {
  return useMutation({
    mutationFn: async (payload: ChangeEmailType) => {
      const res = await https.put('/change-email', payload)
      return res.data
    },
  })
}

export const useConfirmChangeEmail = () => {
  return useMutation({
    mutationFn: async (payload: VerifyConfirmNewEmailType) => {
      const res = await https.post('/confirm-change-email', payload)
      return res.data
    },
  })
}
export const useGetUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const res = await https.get('/getProfile')
      return res.data
    },
  })
}
