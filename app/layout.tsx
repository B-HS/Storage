import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { type FC, type PropsWithChildren, Suspense } from 'react'
import { LocaleResolver } from '@shared/provider/locale-resolver'
import { QueryProvider } from '@shared/provider/query-provider'
import { GoToTop } from '@shared/ui/go-to-top'
import { VirtualScroll } from '@shared/ui/virtual-scroll'
import { cn } from '@shared/util/utils'
import './globals.css'

export const metadata: Metadata = {
    title: { default: 'Storage', template: '%s | Storage' },
    description: '빠르고 안전한 클라우드 스토리지. 파일을 한 곳에서 깔끔하게 관리하세요.',
    openGraph: {
        title: 'Storage',
        description: '빠르고 안전한 클라우드 스토리지',
        type: 'website',
        locale: 'ko_KR',
    },
    robots: { index: true, follow: true },
}

const mplus1Code = localFont({
    src: '../public/fonts/mplus1-code-variable.woff2',
    display: 'swap',
    variable: '--font-sans',
})

const nanumGothic = localFont({
    src: [{ path: '../public/fonts/nanum-gothic-regular.woff2' }, { path: '../public/fonts/nanum-gothic-bold.woff2' }],
    display: 'swap',
    variable: '--font-korean',
})

const RootLayout: FC<PropsWithChildren> = ({ children }) => (
    <html lang='ko' suppressHydrationWarning className={cn('antialiased', mplus1Code.variable, nanumGothic.variable)}>
        <body>
            <Suspense>
                <LocaleResolver>
                    <QueryProvider>{children}</QueryProvider>
                </LocaleResolver>
            </Suspense>
            <VirtualScroll />
            <GoToTop />
        </body>
    </html>
)

export default RootLayout
