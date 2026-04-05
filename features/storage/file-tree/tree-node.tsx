'use client'

import { type FC, useState } from 'react'
import { CaretRightIcon, FolderIcon, FolderOpenIcon } from '@phosphor-icons/react'
import { useDroppable } from '@dnd-kit/core'
import type { DriveFolder, DriveItem } from '@entities/drive/type'
import { useFolderList, useAssetList } from '@entities/drive/query'
import { useDoubleClick } from '@shared/hook/use-double-click'
import { cn } from '@shared/util/utils'
import { useStorageStore } from '@shared/store/storage-store'
import { FileContextMenu } from '@/features/storage/file-context-menu'
import { TreeFileNode } from '@/features/storage/file-tree/tree-file-node'

type TreeNodeProps = {
    userId: string
    folder: DriveFolder
    depth: number
}

const TreeNode: FC<TreeNodeProps> = ({ userId, folder, depth }) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const { currentFolderId, setCurrentFolderId } = useStorageStore()
    const isActive = currentFolderId === folder.id

    const { setNodeRef, isOver } = useDroppable({ id: `folder-drop-${folder.id}`, data: { folderId: folder.id } })

    const { data: childFolders = [] } = useFolderList(userId, folder.id)
    const { data: childAssets } = useAssetList(userId, { folderId: folder.id, page: 1, limit: 100, sort: 'name', order: 'asc' })

    const folderItem: DriveItem = { kind: 'folder', data: folder }

    const { onClick } = useDoubleClick({
        onSingleClick: () => setIsExpanded((prev) => !prev),
        onDoubleClick: () => setCurrentFolderId(folder.id),
    })

    return (
        <div ref={setNodeRef}>
            <FileContextMenu item={folderItem}>
                <button
                    onClick={onClick}
                    className={cn(
                        'flex w-full min-w-0 items-center gap-1.5 py-1 pr-2 text-left text-sm hover:bg-muted',
                        isActive && 'bg-muted',
                        isOver && 'bg-primary/10',
                    )}
                    style={{ paddingLeft: `${depth * 16 + 8}px` }}>
                    <CaretRightIcon className={cn('size-3 shrink-0 transition-transform', isExpanded && 'rotate-90')} />
                    {isExpanded ? (
                        <FolderOpenIcon className='size-4 shrink-0 text-primary' weight='duotone' />
                    ) : (
                        <FolderIcon className='size-4 shrink-0 text-primary' weight='duotone' />
                    )}
                    <span className='truncate'>{folder.name}</span>
                </button>
            </FileContextMenu>
            {isExpanded && (
                <>
                    {childFolders.map((child) => (
                        <TreeNode key={child.id} userId={userId} folder={child} depth={depth + 1} />
                    ))}
                    {(childAssets?.data ?? []).map((asset) => (
                        <TreeFileNode key={asset.id} asset={asset} depth={depth + 1} />
                    ))}
                </>
            )}
        </div>
    )
}

export { TreeNode }
