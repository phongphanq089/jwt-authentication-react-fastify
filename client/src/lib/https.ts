import axios from 'axios'
import { useAuthStore } from '~/stores/useAuthStore'

const https = axios.create({
  baseURL: 'http://127.0.0.1:3000/api/v1/auth',
  withCredentials: true,
})

https.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 410 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        await https.post('/refreshToken')

        return https(originalRequest)
      } catch {
        useAuthStore.getState().logout()
      }
    }
    const message =
      error.response?.data?.message ||
      error.message ||
      'Unknown error from server'

    return Promise.reject(new Error(message))
  }
)

export default https
