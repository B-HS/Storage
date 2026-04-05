import { API_BASE_URL, DRIVE_API_PATH } from '@shared/constant/api'
import type { ApiErrorResponse, DriveUploadResult } from './type'

const MAX_FILE_SIZE = 100 * 1024 * 1024

const BLOCKED_EXTENSIONS = new Set([
    '.exe',
    '.bat',
    '.cmd',
    '.scr',
    '.msi',
    '.pif',
    '.vbs',
    '.js',
    '.ps1',
    '.sh',
    '.com',
    '.jar',
    '.dll',
    '.wsf',
    '.hta',
    '.cpl',
    '.reg',
])

export const validateBeforeUpload = (file: File) => {
    if (file.size > MAX_FILE_SIZE) return 'DRIVE_FILE_TOO_LARGE'
    if (file.size === 0) return 'DRIVE_FILE_EMPTY'
    const ext = file.name.match(/(\.[^.]+)$/)?.[1]?.toLowerCase()
    if (ext && BLOCKED_EXTENSIONS.has(ext)) return 'DRIVE_BLOCKED_EXTENSION'
    return null
}

export const uploadFileWithProgress = (file: File, folderId: string | null, onProgress: (pct: number) => void) => {
    return new Promise<DriveUploadResult>((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        const formData = new FormData()
        formData.append('file', file)
        if (folderId) formData.append('folderId', folderId)

        xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100))
        }

        xhr.onload = () => {
            try {
                if (xhr.status < 200 || xhr.status >= 300) {
                    reject({ success: false, error: { code: 'UPLOAD_FAILED', message: `Upload failed with status ${xhr.status}` } })
                    return
                }
                const json = JSON.parse(xhr.responseText)
                if (json.success) resolve(json.data)
                else reject(json as ApiErrorResponse)
            } catch {
                reject({ success: false, error: { code: 'PARSE_ERROR', message: 'Failed to parse server response' } })
            }
        }

        xhr.onerror = () => reject({ success: false, error: { code: 'NETWORK_ERROR', message: 'Network error' } })

        xhr.open('POST', `${API_BASE_URL}${DRIVE_API_PATH.ASSETS}`)
        xhr.withCredentials = true
        xhr.send(formData)
    })
}
