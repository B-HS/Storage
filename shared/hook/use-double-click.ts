import { useRef } from 'react'
import { DOUBLE_CLICK_GAP_MS } from '@shared/constant/storage'

type UseDoubleClickOptions = {
    onSingleClick?: () => void
    onDoubleClick?: () => void
    gap?: number
}

export const useDoubleClick = ({ onSingleClick, onDoubleClick, gap = DOUBLE_CLICK_GAP_MS }: UseDoubleClickOptions) => {
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const handleClick = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current)
            timerRef.current = null
            onDoubleClick?.()
        } else {
            onSingleClick?.()
            timerRef.current = setTimeout(() => {
                timerRef.current = null
            }, gap)
        }
    }

    return { onClick: handleClick }
}
