'use client'

import { useT } from '@shared/provider/i18n-provider'

const AuthSidebar = () => {
    const { t } = useT()

    return (
        <div className='hidden flex-1 items-center justify-center bg-muted lg:flex'>
            <div className='flex flex-col items-center gap-4 px-8 text-center'>
                <div className='flex size-16 items-center justify-center border bg-background text-2xl font-bold'>B</div>
                <h2 className='text-xl font-semibold tracking-tight'>Storage</h2>
                <p className='max-w-sm text-sm text-muted-foreground'>{t.authLayoutDescription}</p>
            </div>
        </div>
    )
}

export { AuthSidebar }
