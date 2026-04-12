'use client'

import type { FC } from 'react'
import { toast } from 'sonner'
import { getItemName } from '@entities/drive/util'
import { deleteAsset, deleteFolder } from '@entities/drive/api'
import { DRIVE_QUERY_KEY } from '@entities/drive/query-options'
import { useQueryClient } from '@tanstack/react-query'
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
    const queryClient = useQueryClient()

    const handleConfirm = async () => {
        if (!deleteTarget || deleteTarget.length === 0) return
        const items = [...deleteTarget]
        setDeleteTarget(null)
        clearSelection()

        const total = items.length
        let completed = 0
        let failed = 0

        const toastId = toast.loading(t.deleting(0, total))

        for (const item of items) {
            try {
                if (item.kind === 'folder') await deleteFolder(item.data.id)
                else await deleteAsset(item.data.id)
                completed++
            } catch {
                failed++
            }
            toast.loading(t.deleting(completed + failed, total), { id: toastId })
        }

        if (failed === 0) {
            toast.success(t.deleteSuccess, { id: toastId })
        } else {
            toast.error(t.deletePartialFail(failed, total), { id: toastId })
        }

        queryClient.invalidateQueries({ queryKey: DRIVE_QUERY_KEY.all(userId) })
        queryClient.invalidateQueries({ queryKey: DRIVE_QUERY_KEY.quota(userId) })
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
                    <AlertDialogAction onClick={handleConfirm}>{t.delete}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export { DeleteConfirmDialog }
