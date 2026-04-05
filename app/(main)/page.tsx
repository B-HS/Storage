import { HeroSection } from '@/features/landing/hero-section'
import { FeatureSection } from '@/features/landing/feature-section'
import { CtaSection } from '@/features/landing/cta-section'
import { LandingFooter } from '@/features/landing/landing-footer'

const Page = () => (
    <div className='min-h-svh'>
        <HeroSection />
        <FeatureSection />
        <CtaSection />
        <LandingFooter />
    </div>
)

export default Page
