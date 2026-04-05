'use client'

import { motion } from 'framer-motion'
import { HardDrivesIcon, LockIcon, LightningIcon, FolderIcon, MagnifyingGlassIcon, DeviceMobileIcon } from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'
import type { TranslationKeys } from '@shared/i18n/type'
import { useT } from '@shared/provider/i18n-provider'
import { Card, CardDescription, CardHeader, CardTitle } from '@shared/ui/card'

type FeatureDef = {
    icon: Icon
    titleKey: keyof TranslationKeys
    descKey: keyof TranslationKeys
}

const FEATURES: FeatureDef[] = [
    { icon: HardDrivesIcon, titleKey: 'featureUnlimitedTitle', descKey: 'featureUnlimitedDesc' },
    { icon: LockIcon, titleKey: 'featureSecurityTitle', descKey: 'featureSecurityDesc' },
    { icon: LightningIcon, titleKey: 'featureSpeedTitle', descKey: 'featureSpeedDesc' },
    { icon: FolderIcon, titleKey: 'featureFolderTitle', descKey: 'featureFolderDesc' },
    { icon: MagnifyingGlassIcon, titleKey: 'featureSearchTitle', descKey: 'featureSearchDesc' },
    { icon: DeviceMobileIcon, titleKey: 'featureMobileTitle', descKey: 'featureMobileDesc' },
]

const FeatureSection = () => {
    const { t } = useT()

    return (
        <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className='mx-auto max-w-5xl px-6 pb-32'>
            <div className='mb-12 text-center'>
                <h2 className='text-2xl font-bold tracking-tight sm:text-3xl'>{t.featuresSectionTitle}</h2>
                <p className='mt-3 text-muted-foreground'>{t.featuresSectionSubtitle}</p>
            </div>
            <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                {FEATURES.map((feature, i) => (
                    <motion.div
                        key={feature.titleKey}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}>
                        <Card className='h-full'>
                            <CardHeader>
                                <feature.icon className='mb-2 size-6 text-primary' weight='duotone' />
                                <CardTitle className='text-base'>{t[feature.titleKey] as string}</CardTitle>
                                <CardDescription>{t[feature.descKey] as string}</CardDescription>
                            </CardHeader>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </motion.section>
    )
}

export { FeatureSection }
