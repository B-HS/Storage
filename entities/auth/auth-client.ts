import { createAuthClient } from 'better-auth/react'
import { API_BASE_URL } from '@shared/constant/api'

export const authClient = createAuthClient({
    baseURL: API_BASE_URL,
})

export const { signIn, signOut, useSession: useBetterAuthSession, updateUser } = authClient
