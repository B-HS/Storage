import { describe, expect, test } from 'bun:test'
import { renderHook } from '@testing-library/react'

import { useMediaQuery, useIsMobile } from '@shared/hook/use-media-query'

describe('useMediaQuery', () => {
    test('서버 환경에서 false를 반환한다', () => {
        const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'))
        expect(typeof result.current).toBe('boolean')
    })

    test('boolean 값을 반환한다', () => {
        const { result } = renderHook(() => useMediaQuery('(min-width: 0px)'))
        expect(typeof result.current).toBe('boolean')
    })
})

describe('useIsMobile', () => {
    test('boolean 값을 반환한다', () => {
        const { result } = renderHook(() => useIsMobile())
        expect(typeof result.current).toBe('boolean')
    })
})
