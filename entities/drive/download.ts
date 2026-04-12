import { API_BASE_URL, DRIVE_API_PATH } from '@shared/constant/api'

export const downloadAsset = async (assetId: number) => {
    const res = await fetch(`${API_BASE_URL}${DRIVE_API_PATH.ASSET(assetId)}`, { credentials: 'include' })
    if (!res.ok) {
        throw { success: false, error: { code: 'DOWNLOAD_FAILED', message: `Failed to get asset detail` } }
    }

    const json = (await res.json()) as { success: boolean; data: { url: string; originalName: string } }
    if (!json.success) {
        throw { success: false, error: { code: 'DOWNLOAD_FAILED', message: 'Failed to get asset detail' } }
    }

    const { url, originalName } = json.data

    const isStreamUrl = url.startsWith('/api/')
    const downloadUrl = isStreamUrl ? `${API_BASE_URL}${url}` : url

    const fileRes = isStreamUrl ? await fetch(downloadUrl, { credentials: 'include' }) : await fetch(downloadUrl)

    if (!fileRes.ok) {
        throw { success: false, error: { code: 'DOWNLOAD_FAILED', message: `Download failed with status ${fileRes.status}` } }
    }

    const blob = await fileRes.blob()
    let objectUrl = ''

    try {
        objectUrl = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = objectUrl
        a.download = originalName
        a.click()
    } finally {
        if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
}
