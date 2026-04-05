'use server'

import { cookies, headers } from 'next/headers'
import type { Locale } from '@shared/i18n/type'
import { LOCALE_COOKIE_KEY, isValidLocale } from '@shared/i18n'

export const getServerLocale = async () => {
    const headerStore = await headers()
    const fromHeader = headerStore.get('x-locale')
    if (fromHeader && isValidLocale(fromHeader)) return fromHeader

    const cookieStore = await cookies()
    const value = cookieStore.get(LOCALE_COOKIE_KEY)?.value
    if (value && isValidLocale(value)) return value
    return 'ko' as Locale
}

export const setServerLocale = async (locale: Locale) => {
    const cookieStore = await cookies()
    cookieStore.set(LOCALE_COOKIE_KEY, locale, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
        sameSite: 'lax',
    })
}
