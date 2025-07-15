/* eslint-disable @typescript-eslint/no-explicit-any */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import https from '~/lib/https'

interface User {
  id: string
  email: string
  role: 'admin' | 'user'
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: async () => {
        try {
          const res = await https.post('/logout')

          if (res.data) {
            set({ user: null, isAuthenticated: false })
          }
          return res
        } catch (err: any) {
          console.log('Errors ====>', err)
        }
      },
    }),
    {
      name: 'auth-storage', // 👈 key trong localStorage
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
