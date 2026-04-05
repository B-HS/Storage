import { SkeletonBlock } from '@shared/ui/skeleton-block'

const StorageLoading = () => {
    return (
        <div className='flex h-[calc(100svh-2.25rem)]'>
            <aside className='hidden w-64 shrink-0 border-r md:flex md:flex-col'>
                <div className='flex flex-1 flex-col gap-0.5 py-2'>
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className='flex items-center gap-1.5 py-1 pr-2' style={{ paddingLeft: `${(i % 3) * 16 + 8}px` }}>
                            <SkeletonBlock className='size-3 shrink-0' />
                            <SkeletonBlock className='size-4 shrink-0' />
                            <SkeletonBlock className={`h-3.5 ${i % 2 === 0 ? 'w-20' : 'w-14'}`} />
                        </div>
                    ))}
                </div>
                <div className='border-t p-2'>
                    <SkeletonBlock className='h-7 w-full' />
                </div>
            </aside>

            <div className='flex min-w-0 flex-1 flex-col'>
                <div className='flex items-stretch justify-between border-b'>
                    <div className='flex items-center px-1.5'>
                        <SkeletonBlock className='h-3.5 w-8' />
                    </div>
                    <div className='flex items-stretch'>
                        <SkeletonBlock className='size-6' />
                        <SkeletonBlock className='size-6' />
                        <div className='w-px bg-border' />
                        <SkeletonBlock className='size-6' />
                        <SkeletonBlock className='size-6' />
                        <div className='w-px bg-border' />
                        <SkeletonBlock className='size-6' />
                    </div>
                </div>

                <div className='grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-2 p-4'>
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className='flex flex-col items-center gap-2 border p-3'>
                            <SkeletonBlock className='size-12' />
                            <div className='flex w-full flex-col items-center gap-1'>
                                <SkeletonBlock className={`h-3 ${i % 3 === 0 ? 'w-16' : i % 3 === 1 ? 'w-12' : 'w-20'}`} />
                                <SkeletonBlock className='h-2.5 w-10' />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export { StorageLoading }
