import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from '../../../backend/src/trpc/router'

export const api = createTRPCReact<AppRouter>()

// This will be used by tRPC provider
export const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return ''
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  return `http://localhost:4000`
}
