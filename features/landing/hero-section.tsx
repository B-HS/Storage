'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FADE_UP, MOTION_DURATION, STAGGER } from '@shared/constant/motion'
import { useT } from '@shared/provider/i18n-provider'
import { Button } from '@shared/ui/button'

const HeroSection = () => {
    const { t } = useT()

    return (
        <motion.section
            variants={STAGGER}
            initial='initial'
            animate='animate'
            className='flex min-h-[calc(100svh-3.5rem)] flex-col items-center justify-center px-6 text-center'>
            <motion.p variants={FADE_UP} transition={{ duration: MOTION_DURATION }} className='text-sm font-medium text-muted-foreground'>
                {t.heroTagline}
            </motion.p>
            <motion.h1
                variants={FADE_UP}
                transition={{ duration: MOTION_DURATION }}
                className='mt-4 max-w-2xl text-4xl font-bold tracking-tight sm:text-6xl'>
                {t.heroTitle1}
                <br />
                <span className='text-primary'>{t.heroTitle2}</span>
            </motion.h1>
            <motion.p variants={FADE_UP} transition={{ duration: MOTION_DURATION }} className='mt-6 max-w-md text-lg text-muted-foreground'>
                {t.heroDescription}
            </motion.p>
            <motion.div variants={FADE_UP} transition={{ duration: MOTION_DURATION }} className='mt-10 flex gap-3'>
                <Button asChild size='lg'>
                    <Link href='/storage'>{t.heroCtaPrimary}</Link>
                </Button>
                <Button asChild variant='outline' size='lg'>
                    <Link href='/login'>{t.heroCtaSecondary}</Link>
                </Button>
            </motion.div>
        </motion.section>
    )
}

export { HeroSection }
