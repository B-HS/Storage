'use client'

import type { FC } from 'react'
import type { DriveAsset, DriveItem } from '@entities/drive/type'
import { getFileIcon } from '@shared/util/file-icon-map'
import { cn } from '@shared/util/utils'
import { useStorageStore } from '@shared/store/storage-store'
import { FileContextMenu } from '@/features/storage/file-context-menu'

type TreeFileNodeProps = {
    asset: DriveAsset
    depth: number
}

const TreeFileNode: FC<TreeFileNodeProps> = ({ asset, depth }) => {
    const { select, isSelected, setDetailItem } = useStorageStore()
    const id = String(asset.id)
    const selected = isSelected(id)
    const { icon: FileIconComp } = getFileIcon(asset.originalName)
    const assetItem: DriveItem = { kind: 'asset', data: asset }

    const handleClick = () => {
        select(id)
        setDetailItem(assetItem)
    }

    return (
        <FileContextMenu item={assetItem}>
            <button
                onClick={handleClick}
                className={cn('flex w-full min-w-0 items-center gap-1.5 py-1 pr-2 text-left text-sm hover:bg-muted', selected && 'bg-muted')}
                style={{ paddingLeft: `${depth * 16 + 8 + 12 + 6}px` }}>
                <FileIconComp className='size-4 shrink-0 text-muted-foreground' />
                <span className='truncate'>{asset.originalName}</span>
            </button>
        </FileContextMenu>
    )
}

export { TreeFileNode }
