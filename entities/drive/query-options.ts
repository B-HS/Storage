import { queryOptions } from '@tanstack/react-query'
import * as api from './api'
import type { AssetListParams } from './api'

export const DRIVE_QUERY_KEY = {
    all: (userId: string) => ['drive', userId] as const,
    folders: (userId: string) => [...DRIVE_QUERY_KEY.all(userId), 'folders'] as const,
    folderList: (userId: string, parentId?: string) => [...DRIVE_QUERY_KEY.folders(userId), 'list', parentId ?? 'root'] as const,
    folderDetail: (userId: string, folderId: string) => [...DRIVE_QUERY_KEY.folders(userId), 'detail', folderId] as const,
    assets: (userId: string) => [...DRIVE_QUERY_KEY.all(userId), 'assets'] as const,
    assetList: (userId: string, params: AssetListParams) => [...DRIVE_QUERY_KEY.assets(userId), 'list', params] as const,
    assetDetail: (userId: string, assetId: number) => [...DRIVE_QUERY_KEY.assets(userId), 'detail', assetId] as const,
    quota: (userId: string) => [...DRIVE_QUERY_KEY.all(userId), 'quota'] as const,
} as const

export const folderListOptions = (userId: string, parentId?: string) =>
    queryOptions({
        queryKey: DRIVE_QUERY_KEY.folderList(userId, parentId),
        queryFn: () => api.listFolders(parentId),
        staleTime: 30_000,
    })

export const folderDetailOptions = (userId: string, folderId: string) =>
    queryOptions({
        queryKey: DRIVE_QUERY_KEY.folderDetail(userId, folderId),
        queryFn: () => api.getFolderDetail(folderId),
        staleTime: 30_000,
    })

export const assetListOptions = (userId: string, params: AssetListParams) =>
    queryOptions({
        queryKey: DRIVE_QUERY_KEY.assetList(userId, params),
        queryFn: () => api.listAssets(params),
        staleTime: 30_000,
    })

export const assetDetailOptions = (userId: string, assetId: number) =>
    queryOptions({
        queryKey: DRIVE_QUERY_KEY.assetDetail(userId, assetId),
        queryFn: () => api.getAssetDetail(assetId),
        staleTime: 30_000,
    })

export const quotaOptions = (userId: string) =>
    queryOptions({
        queryKey: DRIVE_QUERY_KEY.quota(userId),
        queryFn: () => api.getQuota(),
        staleTime: 60_000,
    })
