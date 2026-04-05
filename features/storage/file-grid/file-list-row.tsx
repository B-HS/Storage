'use client'

import type { FC } from 'react'
import { FolderIcon } from '@phosphor-icons/react'
import type { DriveItem } from '@entities/drive/type'
import { getItemId, getItemName, isImageAsset } from '@entities/drive/util'
import { useDoubleClick } from '@shared/hook/use-double-click'
import { useT } from '@shared/provider/i18n-provider'
import { getFileIcon } from '@shared/util/file-icon-map'
import { formatFileSize } from '@shared/util/format-file-size'
import { cn } from '@shared/util/utils'
import { Checkbox } from '@shared/ui/checkbox'
import { useStorageStore } from '@shared/store/storage-store'
import { FileContextMenu } from '@/features/storage/file-context-menu'

type FileListRowProps = {
    item: DriveItem
    onNavigateFolder?: (folderId: string) => void
}

const FileListRow: FC<FileListRowProps> = ({ item, onNavigateFolder }) => {
    const { toggleSelect, isSelected, setDetailItem, setPreview } = useStorageStore()
    const { locale } = useT()
    const id = getItemId(item)
    const name = getItemName(item)
    const selected = isSelected(id)
    const isFolder = item.kind === 'folder'
    const isImage = isImageAsset(item)
    const { icon: FileIconComp } = getFileIcon(name)

    const { onClick } = useDoubleClick({
        onSingleClick: () => {
            toggleSelect(id)
            setDetailItem(item)
        },
        onDoubleClick: () => {
            if (isFolder) onNavigateFolder?.(item.data.id)
            else if (isImage && item.kind === 'asset') setPreview(item.data, item.data.thumbnail)
        },
    })

    const dateLocale = locale === 'jp' ? 'ja-JP' : locale === 'en' ? 'en-US' : 'ko-KR'
    const formattedDate = new Date(item.data.updatedAt).toLocaleDateString(dateLocale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    })

    return (
        <FileContextMenu item={item}>
            <div
                onClick={onClick}
                className={cn('flex cursor-pointer items-center gap-3 border-b px-4 py-2 text-sm hover:bg-muted', selected && 'bg-muted')}>
                <Checkbox checked={selected} onCheckedChange={() => toggleSelect(id)} onClick={(e) => e.stopPropagation()} />
                {isFolder ? (
                    <FolderIcon className='size-4 shrink-0 text-primary' weight='duotone' />
                ) : (
                    <FileIconComp className='size-4 shrink-0 text-muted-foreground' />
                )}
                <span className='min-w-0 flex-1 truncate'>{name}</span>
                <span className='w-20 shrink-0 text-right text-xs text-muted-foreground'>
                    {item.kind === 'asset' ? formatFileSize(item.data.sizeBytes) : '-'}
                </span>
                <span className='hidden w-24 shrink-0 text-right text-xs text-muted-foreground sm:block'>{formattedDate}</span>
            </div>
        </FileContextMenu>
    )
}

export { FileListRow }
