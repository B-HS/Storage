'use client'

import { ArrowUpIcon } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'

import { Button } from '@shared/ui/button'
import { cn } from '@shared/util/utils'

export const GoToTop = () => {
    const [isTop, setIsTop] = useState(true)

    useEffect(() => {
        window.onscroll = () => setIsTop(window.scrollY === 0)
        return () => {
            window.onscroll = null
        }
    })

    return (
        !isTop && (
            <Button
                variant='secondary'
                size='icon'
                className={cn('fixed bottom-9 right-9 z-50 size-9 border border-primary/10 transition-all', !isTop && 'opacity-100')}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <ArrowUpIcon />
            </Button>
        )
    )
}
