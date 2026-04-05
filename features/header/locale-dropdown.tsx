'use client'

import { GlobeIcon } from '@phosphor-icons/react'
import type { Locale } from '@shared/i18n/type'
import { SUPPORTED_LOCALES } from '@shared/i18n'
import { useT } from '@shared/provider/i18n-provider'
import { Button } from '@shared/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@shared/ui/dropdown-menu'

const LOCALE_LABELS: Record<Locale, string> = {
    ko: '한국어',
    en: 'English',
    jp: '日本語',
}

const LocaleDropdown = () => {
    const { locale, setLocale } = useT()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='ghost' size='icon-xs'>
                    <GlobeIcon className='size-4' />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
                {SUPPORTED_LOCALES.map((l) => (
                    <DropdownMenuItem key={l} onClick={() => setLocale(l)} className={locale === l ? 'bg-muted' : ''}>
                        {LOCALE_LABELS[l]}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export { LocaleDropdown }
