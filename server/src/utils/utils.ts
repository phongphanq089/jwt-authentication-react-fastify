import { ENV_CONFIG } from '@/config/envConfig'

export const urlRedirect = (url: string | undefined) => {
  const defaultUrl = ENV_CONFIG.CLIENT_ORIGIN
  const redirectUrl = url ? url : defaultUrl
  return redirectUrl
}

export const expiresAtToken = Date.now() + 5 * 60 * 1000 // 5 ph
