import type { FC } from 'react'

type SkeletonBlockProps = {
    className?: string
}

const SkeletonBlock: FC<SkeletonBlockProps> = ({ className }) => <div className={`animate-pulse bg-muted ${className ?? ''}`} />

export { SkeletonBlock }
