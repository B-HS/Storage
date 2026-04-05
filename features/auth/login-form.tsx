'use client'

import { GithubLogoIcon, GoogleLogoIcon } from '@phosphor-icons/react'
import { signIn } from '@entities/auth/auth-client'
import { useT } from '@shared/provider/i18n-provider'
import { Button } from '@shared/ui/button'

const LoginForm = () => {
    const { t } = useT()

    const getCallbackURL = () => `${window.location.origin}/storage`

    const handleGithub = () => signIn.social({ provider: 'github', callbackURL: getCallbackURL() })
    const handleGoogle = () => signIn.social({ provider: 'google', callbackURL: getCallbackURL() })

    return (
        <div className='w-full max-w-sm'>
            <div className='mb-8 text-center'>
                <h1 className='text-2xl font-bold tracking-tight'>{t.login}</h1>
                <p className='mt-2 text-sm text-muted-foreground'>{t.loginSubtitle}</p>
            </div>
            <div className='flex flex-col gap-3'>
                <Button variant='outline' className='w-full gap-2' onClick={handleGithub}>
                    <GithubLogoIcon className='size-5' />
                    GitHub
                </Button>
                <Button variant='outline' className='w-full gap-2' onClick={handleGoogle}>
                    <GoogleLogoIcon className='size-5' />
                    Google
                </Button>
            </div>
        </div>
    )
}

export { LoginForm }
