'use client'

import Link from 'next/link'
import { useAuth } from '@shared/provider/auth-provider'
import { LocaleDropdown } from '@/features/header/locale-dropdown'
import { UserDropdown } from '@/features/header/user-dropdown'

const AppHeader = () => {
    const { user } = useAuth()

    return (
        <header className='sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm'>
            <div className='flex h-9 items-center justify-between px-2'>
                <Link href='/' className='inline-flex items-center gap-0.75 font-bold tracking-tight'>
                    <div className='inline-flex aspect-square size-5 items-center justify-center border border-foreground bg-foreground text-background'>
                        B
                    </div>
                    <span>Storage</span>
                </Link>
                {user ? <UserDropdown /> : <LocaleDropdown />}
            </div>
        </header>
    )
}

export { AppHeader }
