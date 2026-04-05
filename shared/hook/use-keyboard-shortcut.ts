import { useEffect } from 'react'

type ShortcutHandler = {
    key: string
    ctrl?: boolean
    handler: () => void
}

export const useKeyboardShortcut = (shortcuts: ShortcutHandler[]) => {
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

            for (const shortcut of shortcuts) {
                const ctrlMatch = shortcut.ctrl ? e.metaKey || e.ctrlKey : !e.metaKey && !e.ctrlKey
                if (e.key === shortcut.key && ctrlMatch) {
                    e.preventDefault()
                    shortcut.handler()
                    return
                }
            }
        }

        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
    }, [shortcuts])
}
