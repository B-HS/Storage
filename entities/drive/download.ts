import { API_BASE_URL } from '@shared/constant/api'
import { getAssetDetail } from './api'

export const downloadAsset = async (assetId: number) => {
    const detail = await getAssetDetail(assetId)

    const isStreamUrl = detail.url.startsWith('/api/')
    const downloadUrl = isStreamUrl ? `${API_BASE_URL}${detail.url}` : detail.url

    const res = isStreamUrl
        ? await fetch(downloadUrl, { credentials: 'include' })
        : await fetch(downloadUrl)

    if (!res.ok) {
        throw { success: false, error: { code: 'DOWNLOAD_FAILED', message: `Download failed with status ${res.status}` } }
    }

    const blob = await res.blob()
    let objectUrl = ''

    try {
        objectUrl = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = objectUrl
        a.download = detail.originalName
        a.click()
    } finally {
        if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
}
