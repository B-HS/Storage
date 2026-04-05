import { describe, expect, mock, test } from 'bun:test'
import { renderHook } from '@testing-library/react'

import { useKeyboardShortcut } from '@shared/hook/use-keyboard-shortcut'

const fireKey = (key: string, opts: Partial<KeyboardEventInit> = {}) => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, ...opts }))
}

describe('useKeyboardShortcut', () => {
    test('등록된 키를 누르면 핸들러가 호출된다', () => {
        const handler = mock()
        renderHook(() => useKeyboardShortcut([{ key: 'Delete', handler }]))

        fireKey('Delete')
        expect(handler).toHaveBeenCalledTimes(1)
    })

    test('등록되지 않은 키는 무시된다', () => {
        const handler = mock()
        renderHook(() => useKeyboardShortcut([{ key: 'Delete', handler }]))

        fireKey('Enter')
        expect(handler).not.toHaveBeenCalled()
    })

    test('ctrl 수식키가 필요한 단축키는 ctrl 없이 작동하지 않는다', () => {
        const handler = mock()
        renderHook(() => useKeyboardShortcut([{ key: 'a', ctrl: true, handler }]))

        fireKey('a')
        expect(handler).not.toHaveBeenCalled()
    })

    test('ctrl 수식키가 필요한 단축키는 ctrl과 함께 작동한다', () => {
        const handler = mock()
        renderHook(() => useKeyboardShortcut([{ key: 'a', ctrl: true, handler }]))

        fireKey('a', { ctrlKey: true })
        expect(handler).toHaveBeenCalledTimes(1)
    })

    test('meta 키(macOS)도 ctrl로 인식한다', () => {
        const handler = mock()
        renderHook(() => useKeyboardShortcut([{ key: 'a', ctrl: true, handler }]))

        fireKey('a', { metaKey: true })
        expect(handler).toHaveBeenCalledTimes(1)
    })
})
