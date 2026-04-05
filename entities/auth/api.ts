'use server'

import { AUTH_API_PATH } from '@shared/constant/api'
import { baseFetch } from '@shared/api/fetch'
import type { User } from './type'

type SessionResponse = {
    session: { id: string; userId: string; expiresAt: string }
    user: User
}

export const getSession = async () => {
    try {
        const res = await baseFetch(AUTH_API_PATH.GET_SESSION)
        if (!res.ok) return null
        const data = (await res.json()) as SessionResponse
        return data.user
    } catch {
        return null
    }
}

export const signOut = async () => {
    await baseFetch(AUTH_API_PATH.SIGN_OUT, { method: 'POST' })
}
