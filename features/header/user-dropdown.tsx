'use client'

import { GlobeIcon, SignOutIcon, UserIcon, HardDrivesIcon } from '@phosphor-icons/react'
import Link from 'next/link'
import type { Locale } from '@shared/i18n/type'
import { SUPPORTED_LOCALES } from '@shared/i18n'
import { useAuth } from '@shared/provider/auth-provider'
import { useT } from '@shared/provider/i18n-provider'
import { Avatar, AvatarFallback, AvatarImage } from '@shared/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@shared/ui/dropdown-menu'

const LOCALE_LABELS: Record<Locale, string> = {
    ko: '한국어',
    en: 'English',
    jp: '日本語',
}

const UserDropdown = () => {
    const { user, logout } = useAuth()
    const { t, locale, setLocale } = useT()

    if (!user) return null

    const fallbackInitial = user.name.charAt(0).toUpperCase()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className='flex items-center gap-2 outline-none'>
                    <Avatar className='size-8 cursor-pointer'>
                        <AvatarImage src={user.image ?? undefined} alt={user.name} />
                        <AvatarFallback className='text-xs font-medium'>{fallbackInitial}</AvatarFallback>
                    </Avatar>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-56'>
                <DropdownMenuLabel className='font-normal'>
                    <div className='flex items-center gap-3'>
                        <Avatar className='size-9'>
                            <AvatarImage src={user.image ?? undefined} alt={user.name} />
                            <AvatarFallback className='text-xs font-medium'>{fallbackInitial}</AvatarFallback>
                        </Avatar>
                        <div className='flex flex-col'>
                            <span className='text-sm font-semibold'>{user.name}</span>
                            <span className='text-xs text-muted-foreground'>{user.email}</span>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href='/mypage'>
                        <UserIcon className='mr-2 size-4' />
                        {t.myPage}
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href='/storage'>
                        <HardDrivesIcon className='mr-2 size-4' />
                        {t.myStorage}
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                        <GlobeIcon className='mr-2 size-4' />
                        {LOCALE_LABELS[locale]}
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                        {SUPPORTED_LOCALES.map((l) => (
                            <DropdownMenuItem key={l} onClick={() => setLocale(l)} className={locale === l ? 'bg-muted' : ''}>
                                {LOCALE_LABELS[l]}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                    <SignOutIcon className='mr-2 size-4' />
                    {t.logout}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export { UserDropdown }
