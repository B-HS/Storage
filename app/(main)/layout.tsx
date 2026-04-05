import type { FC, PropsWithChildren } from 'react'
import { AuthProvider } from '@shared/provider/auth-provider'
import { AppHeader } from '@widgets/header/app-header'

const MainLayout: FC<PropsWithChildren> = ({ children }) => {
    return (
        <AuthProvider>
            <AppHeader />
            <main>{children}</main>
        </AuthProvider>
    )
}

export default MainLayout
