import { Suspense } from 'react'
import { StorageContent } from '@/features/storage/storage-content'
import { StorageLoading } from '@/features/storage/storage-loading'

const StoragePage = () => (
    <Suspense fallback={<StorageLoading />}>
        <StorageContent />
    </Suspense>
)

export default StoragePage
