'use client'

import { createContext, type FC, type PropsWithChildren, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { signOut, useBetterAuthSession } from '@entities/auth/auth-client'
import type { User } from '@entities/auth/type'
import { useT } from '@shared/provider/i18n-provider'

type AuthContextValue = {
    user: User | null
    isLoading: boolean
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
    const { data: session, isPending } = useBetterAuthSession()
    const router = useRouter()
    const { t } = useT()

    const user: User | null = session?.user
        ? { id: session.user.id, name: session.user.name, email: session.user.email, image: session.user.image }
        : null

    const logout = async () => {
        try {
            await signOut()
            router.push('/login')
        } catch {
            toast.error(t.errorUnknown)
        }
    }

    return <AuthContext.Provider value={{ user, isLoading: isPending, logout }}>{children}</AuthContext.Provider>
}

const useAuth = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}

export { AuthProvider, useAuth }
