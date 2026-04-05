export type DriveFolder = {
    id: string
    userId: string
    parentId: string | null
    name: string
    createdAt: string
    updatedAt: string
}

export type DriveFolderDetail = {
    id: string
    name: string
    parentId: string | null
    breadcrumb: { id: string; name: string }[]
    createdAt: string
    updatedAt: string
}

export type DriveFolderCreateInput = {
    name: string
    parentId?: string | null
}

export type DriveFolderUpdateInput = {
    name?: string
    parentId?: string | null
}

export type DriveAsset = {
    id: number
    originalName: string
    mimeType: string
    sizeBytes: number
    folderId: string | null
    isPublic: boolean
    thumbnail: string | null
    createdAt: string
    updatedAt: string
}

export type DriveAssetDetail = DriveAsset & {
    fileHash: string
    url: string
    lastViewedAt: string | null
}

export type DriveUploadResult = {
    id: number
    s3Key: string
    originalName: string
    mimeType: string
    sizeBytes: number
    folderId: string | null
    isPublic: false
    url: string
}

export type DriveAssetUpdateInput = {
    originalName?: string
    isPublic?: boolean
    folderId?: string | null
}

export type DriveQuota = {
    used: number
    total: number
    remaining: number
}

export type DriveItem = { kind: 'folder'; data: DriveFolder } | { kind: 'asset'; data: DriveAsset }

export type DriveSortField = 'created' | 'name' | 'size'
export type DriveSortOrder = 'asc' | 'desc'

export type DriveErrorCode =
    | 'DRIVE_ASSET_NOT_FOUND'
    | 'DRIVE_FILE_TOO_LARGE'
    | 'DRIVE_INVALID_MIME_TYPE'
    | 'DRIVE_DUPLICATE_FILE'
    | 'DRIVE_QUOTA_EXCEEDED'
    | 'DRIVE_FOLDER_NOT_FOUND'
    | 'DRIVE_FOLDER_CIRCULAR_REF'
    | 'DRIVE_FOLDER_NAME_DUPLICATE'
    | 'UNAUTHORIZED'

export type ApiSuccessResponse<T> = { success: true; data: T }
export type ApiPaginatedResponse<T> = { success: true; data: T[]; pagination: { page: number; limit: number; total: number } }
export type ApiErrorResponse = { success: false; error: { code: string; message: string } }
