import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { redirect } from 'next/navigation'
import { connection } from 'next/server'
import { getSession } from '@entities/auth/api'
import { folderListOptions, assetListOptions, quotaOptions } from '@entities/drive/query-options'
import { StorageLayout } from '@widgets/storage/storage-layout'

const StorageContent = async () => {
    await connection()
    const user = await getSession()
    if (!user) redirect('/login')

    const queryClient = new QueryClient()

    await Promise.all([
        queryClient.prefetchQuery(folderListOptions(user.id)),
        queryClient.prefetchQuery(assetListOptions(user.id, { folderId: 'root', page: 1, limit: 100, sort: 'created', order: 'desc' })),
        queryClient.prefetchQuery(quotaOptions(user.id)),
    ])

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <StorageLayout userId={user.id} />
        </HydrationBoundary>
    )
}

export { StorageContent }
