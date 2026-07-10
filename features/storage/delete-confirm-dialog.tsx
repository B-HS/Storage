'use client'

import type { FC } from 'react'
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

type DeleteConfirmDialogProps = {
    open: boolean
    name: string
    onConfirm: () => void
    onCancel: () => void
}

const DeleteConfirmDialog: FC<DeleteConfirmDialogProps> = ({ open, name, onConfirm, onCancel }) => {
    const { t } = useT()

    return (
        <AlertDialog open={open} onOpenChange={(next) => !next && onCancel()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t.deleteConfirmTitle}</AlertDialogTitle>
                    <AlertDialogDescription>{t.deleteConfirmDescription(name)}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm}>{t.delete}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export { DeleteConfirmDialog }
