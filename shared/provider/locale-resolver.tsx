import type { FC, PropsWithChildren } from 'react'
import { cookies } from 'next/headers'
import type { Locale } from '@shared/i18n/type'
import { isValidLocale } from '@shared/i18n'
import { I18nProvider } from '@shared/provider/i18n-provider'

type LocaleResolverProps = PropsWithChildren

const LocaleResolver: FC<LocaleResolverProps> = async ({ children }) => {
    const cookieStore = await cookies()
    const raw = cookieStore.get('storage-locale')?.value
    const locale: Locale = raw && isValidLocale(raw) ? raw : 'ko'

    return <I18nProvider serverLocale={locale}>{children}</I18nProvider>
}

export { LocaleResolver }
