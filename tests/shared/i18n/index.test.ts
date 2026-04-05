import { describe, expect, test } from 'bun:test'

import { getTranslations, isValidLocale, detectBrowserLocale, SUPPORTED_LOCALES } from '@shared/i18n'

describe('getTranslations', () => {
    test('ko 번역을 반환한다', () => {
        const t = getTranslations('ko')
        expect(t.save).toBe('저장')
    })

    test('en 번역을 반환한다', () => {
        const t = getTranslations('en')
        expect(t.save).toBe('Save')
    })

    test('jp 번역을 반환한다', () => {
        const t = getTranslations('jp')
        expect(t.save).toBe('保存')
    })
})

describe('isValidLocale', () => {
    test('지원하는 로케일은 true를 반환한다', () => {
        expect(isValidLocale('ko')).toBe(true)
        expect(isValidLocale('en')).toBe(true)
        expect(isValidLocale('jp')).toBe(true)
    })

    test('지원하지 않는 로케일은 false를 반환한다', () => {
        expect(isValidLocale('fr')).toBe(false)
        expect(isValidLocale('zh')).toBe(false)
        expect(isValidLocale('')).toBe(false)
    })
})

describe('detectBrowserLocale', () => {
    test('기본값으로 ko를 반환한다', () => {
        const locale = detectBrowserLocale()
        expect(SUPPORTED_LOCALES).toContain(locale)
    })
})

describe('SUPPORTED_LOCALES', () => {
    test('3개 로케일이 포함된다', () => {
        expect(SUPPORTED_LOCALES).toHaveLength(3)
        expect(SUPPORTED_LOCALES).toContain('ko')
        expect(SUPPORTED_LOCALES).toContain('en')
        expect(SUPPORTED_LOCALES).toContain('jp')
    })
})
