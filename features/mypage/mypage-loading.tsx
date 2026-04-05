import { SkeletonBlock } from '@shared/ui/skeleton-block'

const MyPageLoading = () => {
    return (
        <div className='mx-auto max-w-lg space-y-6 p-6'>
            <div className='flex flex-col items-center gap-4'>
                <SkeletonBlock className='size-20 rounded-full' />
                <div className='flex flex-col items-center gap-2'>
                    <SkeletonBlock className='h-5 w-24' />
                    <SkeletonBlock className='h-3.5 w-36' />
                </div>
            </div>
            <SkeletonBlock className='h-px w-full' />
            <div className='flex flex-col gap-4 border p-6'>
                <SkeletonBlock className='h-4 w-20' />
                <SkeletonBlock className='h-8 w-full' />
                <SkeletonBlock className='h-8 w-full' />
                <SkeletonBlock className='ml-auto h-8 w-14' />
            </div>
        </div>
    )
}

export { MyPageLoading }
