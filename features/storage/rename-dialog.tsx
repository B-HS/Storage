'use client'

import type { FC } from 'react'
import { getItemName } from '@entities/drive/util'
import { useRenameFolder, useUpdateAsset } from '@entities/drive/query'
import { useT } from '@shared/provider/i18n-provider'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@shared/ui/dialog'
import { VisuallyHidden } from 'radix-ui'
import { useStorageStore } from '@shared/store/storage-store'
import { RenameForm } from '@/features/storage/rename-form'

type RenameDialogProps = {
    userId: string
}

const RenameDialog: FC<RenameDialogProps> = ({ userId }) => {
    const { renameTarget, setRenameTarget } = useStorageStore()
    const { t } = useT()
    const renameFolderMutation = useRenameFolder(userId)
    const updateAssetMutation = useUpdateAsset(userId)

    const isPending = renameFolderMutation.isPending || updateAssetMutation.isPending

    const handleSave = (newName: string) => {
        if (!renameTarget) return
        if (renameTarget.kind === 'folder') renameFolderMutation.mutate({ folderId: renameTarget.data.id, input: { name: newName } })
        else updateAssetMutation.mutate({ assetId: renameTarget.data.id, input: { originalName: newName } })
        setRenameTarget(null)
    }

    const itemName = renameTarget ? getItemName(renameTarget) : ''
    const itemId = renameTarget ? (renameTarget.kind === 'folder' ? renameTarget.data.id : String(renameTarget.data.id)) : ''

    return (
        <Dialog open={renameTarget !== null} onOpenChange={(open) => !open && setRenameTarget(null)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t.renameTitle}</DialogTitle>
                    <VisuallyHidden.Root>
                        <DialogDescription>{t.newName}</DialogDescription>
                    </VisuallyHidden.Root>
                </DialogHeader>
                {renameTarget && <RenameForm key={itemId} initialName={itemName} onSave={handleSave} onCancel={() => setRenameTarget(null)} isPending={isPending} />}
            </DialogContent>
        </Dialog>
    )
}

export { RenameDialog }
