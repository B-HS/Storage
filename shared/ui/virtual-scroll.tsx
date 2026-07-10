'use client'

import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

const FULL_PERCENT = 100
const MIN_THUMB_HEIGHT_PERCENT = 10
const SCROLL_HIDE_DELAY_MS = 1000

const VirtualScrollComponent = () => {
    const path = usePathname()
    const timeoutRef = useRef<NodeJS.Timeout>(null)
    const tickingRef = useRef(false)
    const [scrollData, setScrollData] = useState({ thumbHeight: 0, thumbTop: 0, isScrollable: false })
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        const handleScroll = () => {
            if (tickingRef.current) return
            tickingRef.current = true

            requestAnimationFrame(() => {
                const windowHeight = window.innerHeight
                const documentHeight = document.documentElement.scrollHeight
                const scrollableHeight = documentHeight - windowHeight
                const currentScrollPosition = window.scrollY

                const thumbHeight = (windowHeight / documentHeight) * FULL_PERCENT
                const scrollPercentage = scrollableHeight > 0 ? (currentScrollPosition / scrollableHeight) * FULL_PERCENT : 0
                const thumbTop = (scrollPercentage * (FULL_PERCENT - thumbHeight)) / FULL_PERCENT

                setScrollData({
                    thumbHeight: Math.max(thumbHeight, MIN_THUMB_HEIGHT_PERCENT),
                    thumbTop: Math.min(thumbTop, FULL_PERCENT - thumbHeight),
                    isScrollable: thumbHeight < FULL_PERCENT,
                })

                setIsVisible(true)

                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current)
                }

                const newTimeout = setTimeout(() => {
                    setIsVisible(false)
                }, SCROLL_HIDE_DELAY_MS)

                timeoutRef.current = newTimeout
                tickingRef.current = false
            })
        }

        handleScroll()
        window.addEventListener('scroll', handleScroll)
        window.addEventListener('resize', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
            window.removeEventListener('resize', handleScroll)
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [path])

    return (
        scrollData.isScrollable && (
            <div className='fixed right-0 top-0 z-[60] h-full w-0.75'>
                <div
                    className='absolute right-0 w-0.75 rounded-xs bg-foreground/50 transition-opacity duration-200 will-change-transform'
                    style={{
                        height: `${scrollData.thumbHeight}%`,
                        top: `${scrollData.thumbTop}%`,
                        opacity: isVisible ? 1 : 0,
                    }}
                />
            </div>
        )
    )
}

export const VirtualScroll = dynamic(() => Promise.resolve(VirtualScrollComponent), {
    ssr: false,
})
