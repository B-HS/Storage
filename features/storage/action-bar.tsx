'use client'

import type { FC } from 'react'
import { DownloadSimpleIcon, PencilSimpleIcon, TrashIcon, XIcon } from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { DriveItem } from '@entities/drive/type'
import { getItemId } from '@entities/drive/util'
import { downloadAsset } from '@entities/drive/download'
import { useT } from '@shared/provider/i18n-provider'
import { Button } from '@shared/ui/button'
import { Separator } from '@shared/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@shared/ui/tooltip'
import { useStorageStore } from '@shared/store/storage-store'

type ActionBarProps = {
    items: DriveItem[]
    userId: string
}

const ActionBar: FC<ActionBarProps> = ({ items }) => {
    const { selectedIds, clearSelection, setDeleteTarget, setRenameTarget } = useStorageStore()
    const { t } = useT()

    if (selectedIds.size === 0) return null

    const selectedItems = items.filter((item) => selectedIds.has(getItemId(item)))
    const isSingle = selectedIds.size === 1

    const handleDownload = () => {
        selectedItems.forEach((item) => {
            if (item.kind === 'asset') {
                downloadAsset(item.data.id).catch(() => toast.error(t.errorNetwork))
            }
        })
    }

    return (
        <div className='flex items-stretch'>
            <Separator orientation='vertical' />
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant='ghost' size='icon-xs' onClick={clearSelection}>
                        <XIcon className='size-4' />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>{t.deselect}</TooltipContent>
            </Tooltip>
            <span className='flex items-center text-xs text-muted-foreground'>{t.selectedCount(selectedIds.size)}</span>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant='ghost' size='icon-xs' onClick={handleDownload}>
                        <DownloadSimpleIcon className='size-4' />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>{t.download}</TooltipContent>
            </Tooltip>
            {isSingle && (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant='ghost' size='icon-xs' onClick={() => setRenameTarget(selectedItems[0])}>
                            <PencilSimpleIcon className='size-4' />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>{t.rename}</TooltipContent>
                </Tooltip>
            )}
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant='ghost' size='icon-xs' onClick={() => setDeleteTarget(selectedItems)}>
                        <TrashIcon className='size-4' />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>{t.delete}</TooltipContent>
            </Tooltip>
        </div>
    )
}

export { ActionBar }
