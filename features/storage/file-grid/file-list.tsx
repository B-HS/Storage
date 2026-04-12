'use client'

import type { FC } from 'react'
import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react'
import type { DriveItem } from '@entities/drive/type'
import { getItemId } from '@entities/drive/util'
import { useT } from '@shared/provider/i18n-provider'
import { Button } from '@shared/ui/button'
import { useStorageStore } from '@shared/store/storage-store'
import { FileListRow } from '@/features/storage/file-grid/file-list-row'

type FileListProps = {
    items: DriveItem[]
    onNavigateFolder?: (folderId: string) => void
    pagination?: { page: number; limit: number; total: number }
    isLoading?: boolean
}

const FileList: FC<FileListProps> = ({ items, onNavigateFolder, pagination, isLoading }) => {
    const { t } = useT()
    const { page, setPage } = useStorageStore()
    const totalPages = pagination ? Math.ceil(pagination.total / pagination.limit) : 1

    if (isLoading) {
        return (
            <div>
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className='flex items-center gap-3 border-b px-4 py-2 animate-pulse'>
                        <div className='size-4 rounded bg-muted' />
                        <div className='size-4 rounded bg-muted' />
                        <div className='h-3 flex-1 rounded bg-muted' />
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
                <div className='flex items-center gap-3 border-b px-4 py-2 text-xs font-medium text-muted-foreground'>
                    <span className='w-5 shrink-0' />
                    <span className='w-4 shrink-0' />
                    <span className='flex-1'>{t.columnName}</span>
                    <span className='w-20 shrink-0 text-right'>{t.columnSize}</span>
                    <span className='hidden w-24 shrink-0 text-right sm:block'>{t.columnModified}</span>
                </div>
                {items.map((item) => (
                    <FileListRow key={getItemId(item)} item={item} onNavigateFolder={onNavigateFolder} />
                ))}
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

export { FileList }
