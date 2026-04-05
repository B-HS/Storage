import type { Locale, TranslationKeys } from '@shared/i18n/type'
import { ko } from '@shared/i18n/ko'
import { en } from '@shared/i18n/en'
import { jp } from '@shared/i18n/jp'

const SUPPORTED_LOCALES: Locale[] = ['ko', 'en', 'jp']
const translations: Record<Locale, TranslationKeys> = { ko, en, jp }

export const LOCALE_COOKIE_KEY = 'storage-locale'
export const getTranslations = (locale: Locale) => translations[locale]
export const isValidLocale = (value: string): value is Locale => SUPPORTED_LOCALES.includes(value as Locale)
export const detectBrowserLocale = () => {
    if (typeof window === 'undefined') return 'ko'
    const browserLang = navigator.language.slice(0, 2).toLowerCase()
    if (browserLang === 'ja') return 'jp'
    if (browserLang === 'en') return 'en'
    return 'ko'
}

export { SUPPORTED_LOCALES, type Locale, type TranslationKeys }
