'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FADE_UP, MOTION_DURATION, STAGGER } from '@shared/constant/motion'
import { useT } from '@shared/provider/i18n-provider'
import { Button } from '@shared/ui/button'

const CtaSection = () => {
    const { t } = useT()

    return (
        <motion.section variants={STAGGER} initial='initial' whileInView='animate' viewport={{ once: true }} className='border-t py-24 text-center'>
            <div className='mx-auto max-w-md px-6'>
                <motion.h2 variants={FADE_UP} transition={{ duration: MOTION_DURATION }} className='text-2xl font-bold tracking-tight'>
                    {t.ctaTitle}
                </motion.h2>
                <motion.p variants={FADE_UP} transition={{ duration: MOTION_DURATION }} className='mt-3 text-muted-foreground'>
                    {t.ctaDescription}
                </motion.p>
                <motion.div variants={FADE_UP} transition={{ duration: MOTION_DURATION }} className='mt-8'>
                    <Button asChild size='lg'>
                        <Link href='/login'>{t.ctaButton}</Link>
                    </Button>
                </motion.div>
            </div>
        </motion.section>
    )
}

export { CtaSection }
