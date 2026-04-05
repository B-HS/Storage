'use client'

import { useT } from '@shared/provider/i18n-provider'

const LandingFooter = () => {
    const { t } = useT()

    return (
        <footer className='border-t py-8 text-center text-xs text-muted-foreground'>
            <p>{t.footerCopyright}</p>
        </footer>
    )
}

export { LandingFooter }
