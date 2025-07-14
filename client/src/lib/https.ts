import axios from 'axios'
import { useAuthStore } from '~/stores/useAuthStore'

const https = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
})

https.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 410 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        await https.post('/auth/refresh')

        return https(originalRequest)
      } catch {
        useAuthStore.getState().logout()
      }
    }

    return Promise.reject(error)
  }
)

export default https
