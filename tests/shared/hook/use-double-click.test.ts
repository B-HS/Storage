import { describe, expect, mock, test } from 'bun:test'
import { renderHook, act } from '@testing-library/react'

import { useDoubleClick } from '@shared/hook/use-double-click'

describe('useDoubleClick', () => {
    test('더블클릭 시 onDoubleClick이 호출된다', () => {
        const onSingleClick = mock()
        const onDoubleClick = mock()

        const { result } = renderHook(() => useDoubleClick({ onSingleClick, onDoubleClick, gap: 100 }))

        act(() => {
            result.current.onClick()
            result.current.onClick()
        })

        expect(onDoubleClick).toHaveBeenCalledTimes(1)
        expect(onSingleClick).toHaveBeenCalledTimes(1)
    })

    test('단일 클릭 시 즉시 onSingleClick이 호출된다', () => {
        const onSingleClick = mock()
        const onDoubleClick = mock()

        const { result } = renderHook(() => useDoubleClick({ onSingleClick, onDoubleClick, gap: 50 }))

        act(() => {
            result.current.onClick()
        })

        expect(onSingleClick).toHaveBeenCalledTimes(1)
        expect(onDoubleClick).not.toHaveBeenCalled()
    })

    test('gap 이후 클릭은 새로운 싱글클릭으로 처리된다', async () => {
        const onSingleClick = mock()
        const onDoubleClick = mock()

        const { result } = renderHook(() => useDoubleClick({ onSingleClick, onDoubleClick, gap: 50 }))

        act(() => {
            result.current.onClick()
        })

        await new Promise((r) => setTimeout(r, 100))

        act(() => {
            result.current.onClick()
        })

        expect(onSingleClick).toHaveBeenCalledTimes(2)
        expect(onDoubleClick).not.toHaveBeenCalled()
    })
})
