'use client'

import { type FC, type DragEvent, useState } from 'react'
import { CloudArrowUpIcon } from '@phosphor-icons/react'
import { useT } from '@shared/provider/i18n-provider'

type DropZoneProps = {
    onDrop?: (files: File[]) => void
    children: React.ReactNode
}

const DropZone: FC<DropZoneProps> = ({ onDrop, children }) => {
    const [isDragging, setIsDragging] = useState(false)
    const { t } = useT()

    const handleDragOver = (e: DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e: DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = (e: DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const files = Array.from(e.dataTransfer.files)
        if (files.length > 0) onDrop?.(files)
    }

    return (
        <div className='relative flex-1' onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
            {children}
            {isDragging && (
                <div className='absolute inset-0 z-50 flex flex-col items-center justify-center gap-3 border-2 border-dashed border-primary bg-background/90'>
                    <CloudArrowUpIcon className='size-12 text-primary' weight='duotone' />
                    <p className='text-sm font-medium text-primary'>{t.dropFiles}</p>
                </div>
            )}
        </div>
    )
}

export { DropZone }
