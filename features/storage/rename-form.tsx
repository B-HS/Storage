'use client'

import { type FC, useState } from 'react'
import { useT } from '@shared/provider/i18n-provider'
import { Button } from '@shared/ui/button'
import { DialogFooter } from '@shared/ui/dialog'
import { Input } from '@shared/ui/input'
import { Label } from '@shared/ui/label'

type RenameFormProps = {
    initialName: string
    onSave: (name: string) => void
    onCancel: () => void
    isPending?: boolean
}

const RenameForm: FC<RenameFormProps> = ({ initialName, onSave, onCancel, isPending }) => {
    const [name, setName] = useState(initialName)
    const { t } = useT()

    return (
        <>
            <div className='flex flex-col gap-2'>
                <Label htmlFor='rename-input'>{t.newName}</Label>
                <Input
                    id='rename-input'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && onSave(name)}
                    autoFocus
                />
            </div>
            <DialogFooter>
                <Button variant='outline' onClick={onCancel}>
                    {t.cancel}
                </Button>
                <Button onClick={() => onSave(name)} disabled={!name.trim() || isPending}>
                    {isPending ? '...' : t.save}
                </Button>
            </DialogFooter>
        </>
    )
}

export { RenameForm }
