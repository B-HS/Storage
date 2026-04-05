import { getAssetDetail } from './api'

export const downloadAsset = async (assetId: number) => {
    const { url, originalName } = await getAssetDetail(assetId)
    const res = await fetch(url)

    if (!res.ok) {
        throw { success: false, error: { code: 'DOWNLOAD_FAILED', message: `Download failed with status ${res.status}` } }
    }

    const blob = await res.blob()
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
