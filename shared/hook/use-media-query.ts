import { useSyncExternalStore } from 'react'

export const useMediaQuery = (query: string) => {
    const subscribe = (callback: () => void) => {
        const mql = window.matchMedia(query)
        mql.addEventListener('change', callback)
        return () => mql.removeEventListener('change', callback)
    }

    const getSnapshot = () => window.matchMedia(query).matches
    const getServerSnapshot = () => false

    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export const useIsMobile = () => useMediaQuery('(max-width: 768px)')
