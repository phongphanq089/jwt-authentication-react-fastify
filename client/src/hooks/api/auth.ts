import { useMutation } from '@tanstack/react-query'
import https from '~/lib/https'

export const useLogin = () => {
  return useMutation({
    mutationFn: async (payload: { email: string; password: string }) => {
      const res = await https.post('/login', payload)
      return res.data
    },
  })
}
