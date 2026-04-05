import type { FC, PropsWithChildren } from 'react'
import { AuthSidebar } from '@/features/auth/auth-sidebar'

const AuthLayout: FC<PropsWithChildren> = ({ children }) => {
    return (
        <div className='flex min-h-svh'>
            <AuthSidebar />
            <div className='flex flex-1 items-center justify-center p-6'>{children}</div>
        </div>
    )
}

export default AuthLayout
