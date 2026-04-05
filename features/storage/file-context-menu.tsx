'use client'

import type { FC, PropsWithChildren } from 'react'
import { DownloadSimpleIcon, EyeIcon, PencilSimpleIcon, TrashIcon } from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { DriveItem } from '@entities/drive/type'
import { isImageAsset } from '@entities/drive/util'
import { downloadAsset } from '@entities/drive/download'
import { useT } from '@shared/provider/i18n-provider'
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from '@shared/ui/context-menu'
import { useStorageStore } from '@shared/store/storage-store'

type FileContextMenuProps = PropsWithChildren<{
    item: DriveItem
}>

const FileContextMenu: FC<FileContextMenuProps> = ({ item, children }) => {
    const { setDeleteTarget, setRenameTarget, setPreview } = useStorageStore()
    const { t } = useT()

    const handleDownload = () => {
        if (item.kind === 'asset') downloadAsset(item.data.id).catch(() => toast.error(t.errorNetwork))
    }

    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem onClick={() => setRenameTarget(item)}>
                    <PencilSimpleIcon className='mr-2 size-4' />
                    {t.rename}
                </ContextMenuItem>
                {item.kind === 'asset' && (
                    <ContextMenuItem onClick={handleDownload}>
                        <DownloadSimpleIcon className='mr-2 size-4' />
                        {t.download}
                    </ContextMenuItem>
                )}
                {isImageAsset(item) && (
                    <ContextMenuItem onClick={() => item.kind === 'asset' && setPreview(item.data, item.data.thumbnail)}>
                        <EyeIcon className='mr-2 size-4' />
                        {t.preview}
                    </ContextMenuItem>
                )}
                <ContextMenuSeparator />
                <ContextMenuItem className='text-destructive' onClick={() => setDeleteTarget([item])}>
                    <TrashIcon className='mr-2 size-4' />
                    {t.delete}
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    )
}

export { FileContextMenu }
