'use client'

import type { FC } from 'react'
import { getItemName } from '@entities/drive/util'
import { useDeleteFolder, useDeleteAsset } from '@entities/drive/query'
import { useT } from '@shared/provider/i18n-provider'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@shared/ui/alert-dialog'
import { useStorageStore } from '@shared/store/storage-store'

type DeleteConfirmDialogProps = {
    userId: string
}

const DeleteConfirmDialog: FC<DeleteConfirmDialogProps> = ({ userId }) => {
    const { deleteTarget, setDeleteTarget, clearSelection } = useStorageStore()
    const { t } = useT()
    const deleteFolderMutation = useDeleteFolder(userId)
    const deleteAssetMutation = useDeleteAsset(userId)

    const isPending = deleteFolderMutation.isPending || deleteAssetMutation.isPending

    const handleConfirm = () => {
        if (!deleteTarget) return
        deleteTarget.forEach((item) => {
            if (item.kind === 'folder') deleteFolderMutation.mutate(item.data.id)
            else deleteAssetMutation.mutate(item.data.id)
        })
        setDeleteTarget(null)
        clearSelection()
    }

    const isOpen = deleteTarget !== null && deleteTarget.length > 0
    const count = deleteTarget?.length ?? 0
    const name = count === 1 ? getItemName(deleteTarget![0]) : t.selectedCount(count)

    return (
        <AlertDialog open={isOpen} onOpenChange={(open) => !open && setDeleteTarget(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t.deleteConfirmTitle}</AlertDialogTitle>
                    <AlertDialogDescription>{t.deleteConfirmDescription(name)}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirm} disabled={isPending}>
                        {isPending ? '...' : t.delete}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export { DeleteConfirmDialog }
