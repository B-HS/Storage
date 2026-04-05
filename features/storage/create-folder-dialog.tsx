'use client'

import { type FC, useState } from 'react'
import { useT } from '@shared/provider/i18n-provider'
import { Button } from '@shared/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@shared/ui/dialog'
import { VisuallyHidden } from 'radix-ui'
import { Input } from '@shared/ui/input'
import { Label } from '@shared/ui/label'

type CreateFolderDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: (name: string) => void
    isPending?: boolean
}

const CreateFolderDialog: FC<CreateFolderDialogProps> = ({ open, onOpenChange, onConfirm, isPending }) => {
    const [name, setName] = useState('')
    const { t } = useT()

    const handleSubmit = () => {
        if (!name.trim()) return
        onConfirm(name.trim())
        setName('')
        onOpenChange(false)
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(v) => {
                if (!v) setName('')
                onOpenChange(v)
            }}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t.newFolderTitle}</DialogTitle>
                    <VisuallyHidden.Root>
                        <DialogDescription>{t.folderName}</DialogDescription>
                    </VisuallyHidden.Root>
                </DialogHeader>
                <div className='flex flex-col gap-2'>
                    <Label htmlFor='folder-name-input'>{t.folderName}</Label>
                    <Input
                        id='folder-name-input'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                        placeholder={t.newFolder}
                        autoFocus
                    />
                </div>
                <DialogFooter>
                    <Button variant='outline' onClick={() => onOpenChange(false)}>
                        {t.cancel}
                    </Button>
                    <Button onClick={handleSubmit} disabled={!name.trim() || isPending}>
                        {isPending ? '...' : t.save}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export { CreateFolderDialog }
