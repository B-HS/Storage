import { describe, expect, test } from 'bun:test'

import { ko } from '@shared/i18n/ko'
import { en } from '@shared/i18n/en'
import { jp } from '@shared/i18n/jp'

const getKeys = (obj: Record<string, unknown>): string[] => Object.keys(obj)

describe('i18n 키 완전성', () => {
    const koKeys = getKeys(ko).sort()
    const enKeys = getKeys(en).sort()
    const jpKeys = getKeys(jp).sort()

    test('ko와 en의 키가 동일하다', () => {
        expect(koKeys).toEqual(enKeys)
    })

    test('ko와 jp의 키가 동일하다', () => {
        expect(koKeys).toEqual(jpKeys)
    })

    test('모든 ko 값이 비어있지 않다', () => {
        koKeys.forEach((key) => {
            const value = ko[key as keyof typeof ko]
            if (typeof value === 'string') {
                expect(value.length).toBeGreaterThan(0)
            } else {
                expect(typeof value).toBe('function')
            }
        })
    })

    test('모든 en 값이 비어있지 않다', () => {
        enKeys.forEach((key) => {
            const value = en[key as keyof typeof en]
            if (typeof value === 'string') {
                expect(value.length).toBeGreaterThan(0)
            } else {
                expect(typeof value).toBe('function')
            }
        })
    })

    test('모든 jp 값이 비어있지 않다', () => {
        jpKeys.forEach((key) => {
            const value = jp[key as keyof typeof jp]
            if (typeof value === 'string') {
                expect(value.length).toBeGreaterThan(0)
            } else {
                expect(typeof value).toBe('function')
            }
        })
    })

    test('함수 타입 값이 정상 동작한다', () => {
        expect(ko.selectedCount(3)).toBe('3개')
        expect(en.selectedCount(3)).toBe('3 selected')
        expect(jp.selectedCount(3)).toBe('3件')

        expect(ko.deleteConfirmDescription('test.txt')).toContain('test.txt')
        expect(en.deleteConfirmDescription('test.txt')).toContain('test.txt')
        expect(jp.deleteConfirmDescription('test.txt')).toContain('test.txt')

        expect(ko.detailFileType('PNG')).toContain('PNG')
        expect(en.detailFileType('PNG')).toContain('PNG')
        expect(jp.detailFileType('PNG')).toContain('PNG')
    })
})
