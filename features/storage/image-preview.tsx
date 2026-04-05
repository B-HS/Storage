'use client'

import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { XIcon } from '@phosphor-icons/react'
import { useQuery } from '@tanstack/react-query'
import { getAssetDetail } from '@entities/drive/api'
import { Button } from '@shared/ui/button'
import { useStorageStore } from '@shared/store/storage-store'

const ImagePreview = () => {
    const { previewAsset, setPreview } = useStorageStore()

    const { data: detail, isLoading } = useQuery({
        queryKey: ['drive', 'preview', previewAsset?.id],
        queryFn: () => getAssetDetail(previewAsset!.id),
        enabled: previewAsset !== null,
    })

    useEffect(() => {
        if (!previewAsset) return
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setPreview(null, null)
        }
        window.addEventListener('keydown', handleEsc)
        return () => window.removeEventListener('keydown', handleEsc)
    }, [previewAsset, setPreview])

    if (!previewAsset) return null

    const src = detail?.url ?? previewAsset.thumbnail ?? '/favicon.ico'

    return createPortal(
        <div className='fixed inset-0 z-[100] flex items-center justify-center bg-black/80' onClick={() => setPreview(null, null)}>
            <div
                className='relative flex h-dvh w-dvw flex-col items-center justify-center md:h-auto md:max-h-[90dvh] md:w-auto md:max-w-[90dvw]'
                onClick={(e) => e.stopPropagation()}>
                <Button
                    variant='ghost'
                    size='icon'
                    className='absolute right-2 top-2 z-10 text-white hover:bg-white/20'
                    onClick={() => setPreview(null, null)}>
                    <XIcon className='size-5' />
                </Button>
                {isLoading && !src ? (
                    <div className='size-8 animate-spin border-2 border-white border-t-transparent' />
                ) : src ? (
                    <Image
                        src={src}
                        alt={previewAsset.originalName}
                        width={1200}
                        height={800}
                        unoptimized
                        className='max-h-[85dvh] max-w-[90dvw] object-contain'
                    />
                ) : null}
                <p className='mt-4 text-sm text-white/80'>{previewAsset.originalName}</p>
            </div>
        </div>,
        document.body,
    )
}

export { ImagePreview }
