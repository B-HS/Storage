'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { updateUser } from '@entities/auth/auth-client'
import { useAuth } from '@shared/provider/auth-provider'
import { useT } from '@shared/provider/i18n-provider'
import { Avatar, AvatarFallback, AvatarImage } from '@shared/ui/avatar'
import { Button } from '@shared/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/ui/card'
import { Input } from '@shared/ui/input'
import { Label } from '@shared/ui/label'
import { Separator } from '@shared/ui/separator'

const ProfileCard = () => {
    const { user } = useAuth()
    const { t } = useT()
    const [name, setName] = useState(user?.name ?? '')
    const [isPending, setIsPending] = useState(false)

    if (!user) return null

    const fallbackInitial = user.name.charAt(0).toUpperCase()
    const isDirty = name.trim() !== user.name

    const handleSave = async () => {
        if (!isDirty || !name.trim()) return
        setIsPending(true)
        try {
            await updateUser({ name: name.trim() })
            toast.success(t.renameSuccess)
        } catch {
            toast.error(t.errorUnknown)
        } finally {
            setIsPending(false)
        }
    }

    return (
        <div className='mx-auto max-w-lg space-y-6 p-6'>
            <div className='flex flex-col items-center gap-4'>
                <Avatar className='size-20'>
                    <AvatarImage src={user.image ?? undefined} alt={user.name} />
                    <AvatarFallback className='text-2xl font-medium'>{fallbackInitial}</AvatarFallback>
                </Avatar>
                <div className='text-center'>
                    <h1 className='text-xl font-bold'>{user.name}</h1>
                    <p className='text-sm text-muted-foreground'>{user.email}</p>
                </div>
            </div>

            <Separator />

            <Card>
                <CardHeader>
                    <CardTitle className='text-base'>{t.profileEdit}</CardTitle>
                    <CardDescription>{t.profileEditDesc}</CardDescription>
                </CardHeader>
                <CardContent className='flex flex-col gap-4'>
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor='profile-name'>{t.name}</Label>
                        <Input id='profile-name' value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor='profile-email'>{t.email}</Label>
                        <Input id='profile-email' type='email' value={user.email} disabled />
                    </div>
                    <Button className='self-end' onClick={handleSave} disabled={!isDirty || isPending}>
                        {isPending ? '...' : t.save}
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}

export { ProfileCard }
