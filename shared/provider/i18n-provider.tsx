'use client'

import { createContext, type FC, type PropsWithChildren, useContext, useEffect, useSyncExternalStore } from 'react'
import { type Locale, type TranslationKeys, LOCALE_COOKIE_KEY, getTranslations, isValidLocale, detectBrowserLocale } from '@shared/i18n'

type I18nContextValue = {
    locale: Locale
    t: TranslationKeys
    setLocale: (locale: Locale) => void
}

type I18nProviderProps = PropsWithChildren<{
    serverLocale?: Locale
}>

const I18nContext = createContext<I18nContextValue | null>(null)

const FALLBACK_LOCALE: Locale = 'ko'

const readCookieLocale = () => {
    const match = document.cookie.match(new RegExp(`${LOCALE_COOKIE_KEY}=([^;]+)`))
    if (match && isValidLocale(match[1])) return match[1]
    return detectBrowserLocale()
}

const writeCookieLocale = (locale: Locale) => {
    const secure = window.location.protocol === 'https:' ? ';secure' : ''
    document.cookie = `${LOCALE_COOKIE_KEY}=${locale};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax${secure}`
}

let cachedLocale: Locale = FALLBACK_LOCALE
let listeners: Array<() => void> = []

if (typeof window !== 'undefined') {
    cachedLocale = readCookieLocale()
    if (!document.cookie.includes(LOCALE_COOKIE_KEY)) {
        writeCookieLocale(cachedLocale)
    }
}

const LOCALE_TO_LANG = { ko: 'ko', en: 'en', jp: 'ja' } as const

const I18nProvider: FC<I18nProviderProps> = ({ children, serverLocale }) => {
    const snapshot = serverLocale ?? FALLBACK_LOCALE

    const locale = useSyncExternalStore(
        (listener) => {
            listeners.push(listener)
            return () => {
                listeners = listeners.filter((l) => l !== listener)
            }
        },
        () => cachedLocale,
        () => snapshot,
    )

    useEffect(() => {
        document.documentElement.lang = LOCALE_TO_LANG[locale]
    }, [locale])

    const setLocale = (newLocale: Locale) => {
        cachedLocale = newLocale
        writeCookieLocale(newLocale)
        listeners.forEach((l) => l())
    }

    const t = getTranslations(locale)

    return <I18nContext.Provider value={{ locale, t, setLocale }}>{children}</I18nContext.Provider>
}

const useT = () => {
    const ctx = useContext(I18nContext)
    if (!ctx) throw new Error('useT must be used within I18nProvider')
    return ctx
}

export { I18nProvider, useT }
