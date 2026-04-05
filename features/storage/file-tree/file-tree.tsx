'use client'

import type { FC } from 'react'
import { ArrowLeftIcon, FolderPlusIcon } from '@phosphor-icons/react'
import type { DriveAsset, DriveFolder, DriveQuota } from '@entities/drive/type'
import { useT } from '@shared/provider/i18n-provider'
import { Button } from '@shared/ui/button'
import { ScrollArea } from '@shared/ui/scroll-area'
import { useStorageStore } from '@shared/store/storage-store'
import { TreeNode } from '@/features/storage/file-tree/tree-node'
import { TreeFileNode } from '@/features/storage/file-tree/tree-file-node'
import { QuotaBar } from '@/features/storage/file-tree/quota-bar'

type FileTreeProps = {
    userId: string
    folders: DriveFolder[]
    assets: DriveAsset[]
    quota?: DriveQuota | null
    onCreateFolder?: () => void
}

const FileTree: FC<FileTreeProps> = ({ userId, folders, assets, quota, onCreateFolder }) => {
    const { t } = useT()
    const { currentFolderId, setCurrentFolderId } = useStorageStore()

    const handleGoUp = () => setCurrentFolderId(null)

    return (
        <div className='flex h-full min-h-0 flex-col'>
            <ScrollArea className='min-h-0 flex-1'>
                <div className='py-2'>
                    {currentFolderId && (
                        <button
                            onClick={handleGoUp}
                            className='flex w-full items-center gap-1.5 px-2 py-1 text-left text-xs text-muted-foreground hover:bg-muted'>
                            <ArrowLeftIcon className='size-3.5' />
                            {t.home}
                        </button>
                    )}
                    {folders.map((folder) => (
                        <TreeNode key={folder.id} userId={userId} folder={folder} depth={0} />
                    ))}
                    {assets.map((asset) => (
                        <TreeFileNode key={asset.id} asset={asset} depth={0} />
                    ))}
                </div>
            </ScrollArea>
            <div className='flex flex-col gap-2 border-t p-2'>
                <Button variant='ghost' size='sm' className='w-full justify-start gap-2 text-xs' onClick={onCreateFolder}>
                    <FolderPlusIcon className='size-4' />
                    {t.newFolder}
                </Button>
                {quota && <QuotaBar quota={quota} />}
            </div>
        </div>
    )
}

export { FileTree }
