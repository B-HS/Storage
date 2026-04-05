'use client'

import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

const VirtualScrollComponent = () => {
    const path = usePathname()
    const timeoutRef = useRef<NodeJS.Timeout>(null)
    const tickingRef = useRef(false)
    const [scrollData, setScrollData] = useState({ thumbHeight: 0, thumbTop: 0, isScrollable: false })
    const [isVisible, setIsVisible] = useState(true)

    const handleScroll = useCallback(() => {
        if (tickingRef.current) return
        tickingRef.current = true

        requestAnimationFrame(() => {
            const windowHeight = window.innerHeight
            const documentHeight = document.documentElement.scrollHeight
            const scrollableHeight = documentHeight - windowHeight
            const currentScrollPosition = window.scrollY

            const thumbHeight = (windowHeight / documentHeight) * 100
            const scrollPercentage = scrollableHeight > 0 ? (currentScrollPosition / scrollableHeight) * 100 : 0
            const thumbTop = (scrollPercentage * (100 - thumbHeight)) / 100

            setScrollData({
                thumbHeight: Math.max(thumbHeight, 10),
                thumbTop: Math.min(thumbTop, 100 - thumbHeight),
                isScrollable: thumbHeight < 100,
            })

            setIsVisible(true)

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }

            const newTimeout = setTimeout(() => {
                setIsVisible(false)
            }, 1000)

            timeoutRef.current = newTimeout
            tickingRef.current = false
        })
    }, [])

    useEffect(() => {
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
    }, [handleScroll])

    useEffect(() => {
        handleScroll()
    }, [path, handleScroll])

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
