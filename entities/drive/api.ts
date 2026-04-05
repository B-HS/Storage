'use server'

import { serverFetch, serverFetchPaginated } from '@shared/api/fetch'
import { DRIVE_API_PATH } from '@shared/constant/api'
import type {
    DriveAsset,
    DriveAssetDetail,
    DriveAssetUpdateInput,
    DriveFolder,
    DriveFolderCreateInput,
    DriveFolderDetail,
    DriveFolderUpdateInput,
    DriveQuota,
    DriveSortField,
    DriveSortOrder,
} from './type'

export const createFolder = async (input: DriveFolderCreateInput) => {
    return serverFetch<DriveFolder>(DRIVE_API_PATH.FOLDERS, {
        method: 'POST',
        body: JSON.stringify(input),
    })
}

export const listFolders = async (parentId?: string) => {
    const query = new URLSearchParams()
    if (parentId) query.set('parentId', parentId)
    const qs = query.toString()
    return serverFetch<DriveFolder[]>(`${DRIVE_API_PATH.FOLDERS}${qs ? `?${qs}` : ''}`)
}

export const getFolderDetail = async (folderId: string) => {
    return serverFetch<DriveFolderDetail>(DRIVE_API_PATH.FOLDER(folderId))
}

export const updateFolder = async (folderId: string, input: DriveFolderUpdateInput) => {
    return serverFetch<DriveFolder>(DRIVE_API_PATH.FOLDER(folderId), {
        method: 'PATCH',
        body: JSON.stringify(input),
    })
}

export const deleteFolder = async (folderId: string) => {
    await serverFetch<void>(DRIVE_API_PATH.FOLDER(folderId), { method: 'DELETE' })
}

export type AssetListParams = {
    folderId?: string
    page?: number
    limit?: number
    sort?: DriveSortField
    order?: DriveSortOrder
}

export const listAssets = async (params?: AssetListParams) => {
    const query = new URLSearchParams()
    if (params?.folderId) query.set('folderId', params.folderId)
    if (params?.page) query.set('page', String(params.page))
    if (params?.limit) query.set('limit', String(params.limit))
    if (params?.sort) query.set('sort', params.sort)
    if (params?.order) query.set('order', params.order)

    const qs = query.toString()
    return serverFetchPaginated<DriveAsset>(`${DRIVE_API_PATH.ASSETS}${qs ? `?${qs}` : ''}`)
}

export const getAssetDetail = async (assetId: number) => {
    return serverFetch<DriveAssetDetail>(DRIVE_API_PATH.ASSET(assetId))
}

export const updateAsset = async (assetId: number, input: DriveAssetUpdateInput) => {
    await serverFetch<void>(DRIVE_API_PATH.ASSET(assetId), {
        method: 'PATCH',
        body: JSON.stringify(input),
    })
}

export const deleteAsset = async (assetId: number) => {
    await serverFetch<void>(DRIVE_API_PATH.ASSET(assetId), { method: 'DELETE' })
}

export const getQuota = async () => {
    return serverFetch<DriveQuota>(DRIVE_API_PATH.QUOTA)
}
