'use client'

import type { FC } from 'react'
import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react'
import type { DriveItem } from '@entities/drive/type'
import { getItemId } from '@entities/drive/util'
import { ZOOM_GRID_SIZES } from '@shared/constant/storage'
import { useT } from '@shared/provider/i18n-provider'
import { Button } from '@shared/ui/button'
import { useStorageStore } from '@shared/store/storage-store'
import { FileCard } from '@/features/storage/file-grid/file-card'

type FileGridProps = {
    items: DriveItem[]
    onNavigateFolder?: (folderId: string) => void
    pagination?: { page: number; limit: number; total: number }
    isLoading?: boolean
}

const FileGrid: FC<FileGridProps> = ({ items, onNavigateFolder, pagination, isLoading }) => {
    const { zoomLevel, page, setPage } = useStorageStore()
    const { t } = useT()
    const { minmax } = ZOOM_GRID_SIZES[zoomLevel]

    const totalPages = pagination ? Math.ceil(pagination.total / pagination.limit) : 1

    if (isLoading) {
        return (
            <div className='grid gap-2 p-4' style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${minmax}, 1fr))` }}>
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className='flex flex-col items-center gap-2 border p-3 animate-pulse'>
                        <div className='size-12 rounded bg-muted' />
                        <div className='h-3 w-16 rounded bg-muted' />
                    </div>
                ))}
            </div>
        )
    }

    if (items.length === 0) {
        return <div className='flex flex-1 items-center justify-center py-20 text-sm text-muted-foreground'>{t.emptyFolder}</div>
    }

    return (
        <div className='flex flex-1 flex-col'>
            <div className='flex-1'>
                <div className='grid gap-2 p-4' style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${minmax}, 1fr))` }}>
                    {items.map((item) => (
                        <FileCard key={getItemId(item)} item={item} onNavigateFolder={onNavigateFolder} />
                    ))}
                </div>
            </div>
            {totalPages > 1 && (
                <div className='flex items-center justify-center gap-2 border-t py-2'>
                    <Button variant='ghost' size='icon-xs' onClick={() => setPage(page - 1)} disabled={page <= 1}>
                        <CaretLeftIcon className='size-4' />
                    </Button>
                    <span className='text-xs text-muted-foreground'>
                        {page} / {totalPages}
                    </span>
                    <Button variant='ghost' size='icon-xs' onClick={() => setPage(page + 1)} disabled={page >= totalPages}>
                        <CaretRightIcon className='size-4' />
                    </Button>
                </div>
            )}
        </div>
    )
}

export { FileGrid }
