import { API_BASE_URL, UPLOAD_SERVER_URL, DRIVE_API_PATH } from '@shared/constant/api'
import type { ApiErrorResponse } from './type'

const MAX_FILE_SIZE = Number(process.env.NEXT_PUBLIC_MAX_UPLOAD_SIZE_BYTES ?? 100 * 1024 * 1024 * 1024)

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

type PrepareResult = {
    assetId: number
    s3Key: string
    uploadToken: string
    uploadStatus: string
}

const computeFileHash = async (file: File): Promise<string> => {
    const buffer = await file.arrayBuffer()
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
    return Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
}

const prepareUpload = async (file: File, folderId: string | null, fileHash: string): Promise<PrepareResult> => {
    const res = await fetch(`${API_BASE_URL}${DRIVE_API_PATH.ASSETS}/prepare`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
            originalName: file.name,
            mimeType: file.type,
            sizeBytes: file.size,
            folderId,
            fileHash,
        }),
    })

    const json = await res.json()
    if (!res.ok || !json.success) {
        throw json as ApiErrorResponse
    }
    return json.data as PrepareResult
}

export const uploadFileWithProgress = async (file: File, folderId: string | null, onProgress: (pct: number) => void) => {
    const fileHash = await computeFileHash(file)
    const prepared = await prepareUpload(file, folderId, fileHash)

    return new Promise<{ success: true; assetId: number }>((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        const formData = new FormData()
        formData.append('file', file)
        formData.append('assetId', String(prepared.assetId))
        formData.append('s3Key', prepared.s3Key)
        formData.append('uploadToken', prepared.uploadToken)

        xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100))
        }

        xhr.onload = () => {
            try {
                if (xhr.status < 200 || xhr.status >= 300) {
                    const json = JSON.parse(xhr.responseText) as { error?: string }
                    reject({ success: false, error: { code: 'UPLOAD_FAILED', message: json.error ?? `Upload failed with status ${xhr.status}` } } satisfies ApiErrorResponse)
                    return
                }
                const json = JSON.parse(xhr.responseText) as { success: boolean; error?: string }
                if (json.success) resolve({ success: true, assetId: prepared.assetId })
                else reject({ success: false, error: { code: 'UPLOAD_FAILED', message: json.error ?? 'Upload failed' } } satisfies ApiErrorResponse)
            } catch {
                reject({ success: false, error: { code: 'PARSE_ERROR', message: 'Failed to parse server response' } } satisfies ApiErrorResponse)
            }
        }

        xhr.onerror = () => reject({ success: false, error: { code: 'NETWORK_ERROR', message: 'Network error' } } satisfies ApiErrorResponse)

        xhr.open('POST', `${UPLOAD_SERVER_URL}/upload`)
        xhr.send(formData)
    })
}
