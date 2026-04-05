import { describe, expect, test } from 'bun:test'

import { cn } from '@shared/util/utils'

describe('cn', () => {
    test('여러 클래스를 합친다', () => {
        expect(cn('a', 'b')).toBe('a b')
    })

    test('조건부 클래스를 처리한다', () => {
        expect(cn('base', false && 'hidden', 'visible')).toBe('base visible')
    })

    test('undefined와 null을 무시한다', () => {
        expect(cn('a', undefined, null, 'b')).toBe('a b')
    })

    test('충돌하는 Tailwind 클래스를 병합한다', () => {
        expect(cn('px-2', 'px-4')).toBe('px-4')
    })

    test('충돌하지 않는 Tailwind 클래스는 모두 유지한다', () => {
        expect(cn('px-2', 'py-4')).toBe('px-2 py-4')
    })

    test('빈 입력에 빈 문자열을 반환한다', () => {
        expect(cn()).toBe('')
    })
})
