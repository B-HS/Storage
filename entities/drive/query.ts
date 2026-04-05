'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useT } from '@shared/provider/i18n-provider'
import type { TranslationKeys } from '@shared/i18n/type'
import type { QueryClient } from '@tanstack/react-query'
import * as api from './api'
import type { AssetListParams } from './api'
import type { DriveFolder, DriveFolderCreateInput, DriveFolderUpdateInput, DriveAssetUpdateInput } from './type'
import { getDriveErrorMessage, isUnauthorizedError } from './error'
import { DRIVE_QUERY_KEY, folderListOptions, folderDetailOptions, assetListOptions, quotaOptions } from './query-options'

export { DRIVE_QUERY_KEY, folderListOptions, folderDetailOptions, assetListOptions, quotaOptions }

type DriveMutationOptions<TVariables, TData = void> = {
    mutationFn: (variables: TVariables) => Promise<TData>
    onSuccess: (queryClient: QueryClient, t: TranslationKeys) => void
}

const useDriveMutation = <TVariables, TData = void>(options: DriveMutationOptions<TVariables, TData>) => {
    const queryClient = useQueryClient()
    const { t } = useT()
    const router = useRouter()

    return useMutation({
        mutationFn: options.mutationFn,
        onSuccess: () => options.onSuccess(queryClient, t),
        onError: (error) => {
            if (isUnauthorizedError(error)) return router.push('/login')
            toast.error(getDriveErrorMessage(error, t))
        },
    })
}

export const useFolderList = (userId: string, parentId?: string) => useQuery(folderListOptions(userId, parentId))

export const useFolderDetail = (userId: string, folderId: string | null) =>
    useQuery({
        ...folderDetailOptions(userId, folderId!),
        enabled: folderId !== null,
    })

export const useAssetList = (userId: string, params: AssetListParams) => useQuery(assetListOptions(userId, params))

export const useQuota = (userId: string) => useQuery(quotaOptions(userId))

export const useCreateFolder = (userId: string) =>
    useDriveMutation<DriveFolderCreateInput, DriveFolder>({
        mutationFn: (input) => api.createFolder(input),
        onSuccess: (qc, t) => {
            toast.success(t.folderCreated)
            qc.invalidateQueries({ queryKey: DRIVE_QUERY_KEY.folders(userId) })
        },
    })

export const useRenameFolder = (userId: string) =>
    useDriveMutation<{ folderId: string; input: DriveFolderUpdateInput }, DriveFolder>({
        mutationFn: ({ folderId, input }) => api.updateFolder(folderId, input),
        onSuccess: (qc, t) => {
            toast.success(t.renameSuccess)
            qc.invalidateQueries({ queryKey: DRIVE_QUERY_KEY.folders(userId) })
        },
    })

export const useDeleteFolder = (userId: string) =>
    useDriveMutation<string>({
        mutationFn: (folderId) => api.deleteFolder(folderId),
        onSuccess: (qc, t) => {
            toast.success(t.deleteSuccess)
            qc.invalidateQueries({ queryKey: DRIVE_QUERY_KEY.all(userId) })
        },
    })

export const useUpdateAsset = (userId: string) =>
    useDriveMutation<{ assetId: number; input: DriveAssetUpdateInput }>({
        mutationFn: ({ assetId, input }) => api.updateAsset(assetId, input),
        onSuccess: (qc, t) => {
            toast.success(t.renameSuccess)
            qc.invalidateQueries({ queryKey: DRIVE_QUERY_KEY.assets(userId) })
        },
    })

export const useMoveAsset = (userId: string) =>
    useDriveMutation<{ assetId: number; folderId: string | null }>({
        mutationFn: ({ assetId, folderId }) => api.updateAsset(assetId, { folderId }),
        onSuccess: (qc, t) => {
            toast.success(t.moveSuccess)
            qc.invalidateQueries({ queryKey: DRIVE_QUERY_KEY.all(userId) })
        },
    })

export const useMoveFolder = (userId: string) =>
    useDriveMutation<{ folderId: string; parentId: string | null }, DriveFolder>({
        mutationFn: ({ folderId, parentId }) => api.updateFolder(folderId, { parentId }),
        onSuccess: (qc, t) => {
            toast.success(t.moveSuccess)
            qc.invalidateQueries({ queryKey: DRIVE_QUERY_KEY.all(userId) })
        },
    })

export const useDeleteAsset = (userId: string) =>
    useDriveMutation<number>({
        mutationFn: (assetId) => api.deleteAsset(assetId),
        onSuccess: (qc, t) => {
            toast.success(t.deleteSuccess)
            qc.invalidateQueries({ queryKey: DRIVE_QUERY_KEY.assets(userId) })
            qc.invalidateQueries({ queryKey: DRIVE_QUERY_KEY.quota(userId) })
        },
    })
