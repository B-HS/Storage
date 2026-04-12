import type { TranslationKeys } from '@shared/i18n/type'
import type { ApiErrorResponse, DriveErrorCode } from './type'

type ErrorMessageMap = Partial<Record<DriveErrorCode, keyof TranslationKeys>>

const ERROR_MESSAGE_MAP: ErrorMessageMap = {
    DRIVE_FILE_TOO_LARGE: 'errorFileTooLarge',
    DRIVE_QUOTA_EXCEEDED: 'errorQuotaExceeded',
    DRIVE_DUPLICATE_FILE: 'errorDuplicateFile',
    DRIVE_FOLDER_NAME_DUPLICATE: 'errorFolderNameDuplicate',
    DRIVE_FOLDER_CIRCULAR_REF: 'errorCircularRef',
    DRIVE_ASSET_NOT_FOUND: 'errorAssetNotFound',
    DRIVE_FOLDER_NOT_FOUND: 'errorFolderNotFound',
    DRIVE_INVALID_MIME_TYPE: 'errorInvalidMimeType',
    DRIVE_ALL_TIERS_FAILED: 'errorAllTiersFailed',
    DRIVE_UPLOAD_EVENT_FAILED: 'errorUploadEventFailed',
    UNAUTHORIZED: 'errorUnauthorized',
}

const isApiErrorResponse = (error: unknown): error is ApiErrorResponse =>
    typeof error === 'object' && error !== null && 'success' in error && 'error' in error

export const getDriveErrorMessage = (error: unknown, t: TranslationKeys) => {
    if (!isApiErrorResponse(error)) return t.errorUnknown

    const code = error.error.code as DriveErrorCode
    const key = ERROR_MESSAGE_MAP[code]
    if (key) {
        const msg = t[key]
        return typeof msg === 'string' ? msg : error.error.message
    }
    return error.error.message
}

export const isUnauthorizedError = (error: unknown) => {
    return isApiErrorResponse(error) && error.error.code === 'UNAUTHORIZED'
}
