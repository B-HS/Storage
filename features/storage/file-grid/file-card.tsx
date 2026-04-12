'use client'

import { FolderIcon } from '@phosphor-icons/react'
import Image from 'next/image'
import type { FC } from 'react'
import { useDraggable } from '@dnd-kit/core'
import type { DriveItem } from '@entities/drive/type'
import { getItemId, getItemName, isImageAsset } from '@entities/drive/util'
import { ZOOM_GRID_SIZES } from '@shared/constant/storage'
import { useDoubleClick } from '@shared/hook/use-double-click'
import { getFileIcon } from '@shared/util/file-icon-map'
import { formatFileSize } from '@shared/util/format-file-size'
import { cn } from '@shared/util/utils'
import { useIsMobile } from '@shared/hook/use-media-query'
import { useStorageStore } from '@shared/store/storage-store'
import { FileContextMenu } from '@/features/storage/file-context-menu'

type FileCardProps = {
    item: DriveItem
    onNavigateFolder?: (folderId: string) => void
}

const FileCard: FC<FileCardProps> = ({ item, onNavigateFolder }) => {
    const isMobile = useIsMobile()
    const { select, isSelected, setDetailItem, setPreview, zoomLevel } = useStorageStore()
    const id = getItemId(item)
    const name = getItemName(item)
    const selected = isSelected(id)
    const isFolder = item.kind === 'folder'
    const isImage = isImageAsset(item)
    const isPreparing = item.kind === 'asset' && (item.data.uploadStatus === 'preparing' || item.data.uploadStatus === 'uploading')
    const { icon: FileIconComp } = getFileIcon(name)
    const zoom = ZOOM_GRID_SIZES[zoomLevel]
    const thumbnail = item.kind === 'asset' ? item.data.thumbnail : null

    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id, data: { item } })

    const { onClick } = useDoubleClick({
        onSingleClick: () => {
            if (isMobile) {
                if (isFolder) onNavigateFolder?.(item.data.id)
                else {
                    select(id)
                    setDetailItem(item)
                }
            } else {
                select(id)
                setDetailItem(item)
            }
        },
        onDoubleClick: () => {
            if (!isMobile) {
                if (isFolder) onNavigateFolder?.(item.data.id)
                else if (isImage && item.kind === 'asset') setPreview(item.data, item.data.thumbnail)
            }
        },
    })

    const iconSize = Number(zoom.icon.replace('size-', '')) * 4

    return (
        <FileContextMenu item={item}>
            <button
                ref={setNodeRef}
                {...attributes}
                {...listeners}
                onClick={onClick}
                className={cn(
                    'flex w-full flex-col items-center gap-2 border p-3 text-center transition-colors hover:bg-muted',
                    selected && 'border-primary bg-muted',
                    isDragging && 'opacity-50',
                    isPreparing && 'opacity-60 animate-pulse',
                )}>
                <div className={cn('flex items-center justify-center', zoom.container)}>
                    {isImage && thumbnail ? (
                        <Image src={thumbnail} alt={name} width={iconSize} height={iconSize} className={cn(zoom.container, 'object-cover')} />
                    ) : isFolder ? (
                        <FolderIcon className={cn(zoom.icon, 'text-primary')} />
                    ) : (
                        <FileIconComp className={cn(zoom.icon, 'text-muted-foreground')} />
                    )}
                </div>
                <div className='w-full min-w-0'>
                    <p className={cn('truncate font-normal', zoom.text, isPreparing && 'text-muted-foreground')}>{name}</p>
                    {item.kind === 'asset' && (
                        <p className='text-[10px] text-muted-foreground'>
                            {isPreparing ? '업로드 중...' : item.data.uploadStatus === 'failed' ? '업로드 실패' : formatFileSize(item.data.sizeBytes)}
                        </p>
                    )}
                </div>
            </button>
        </FileContextMenu>
    )
}

export { FileCard }
