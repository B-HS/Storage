const UNITS = ['B', 'KB', 'MB', 'GB', 'TB'] as const
const THRESHOLDS = [1024, 2 * 1024 * 1024, 1024 * 1024 * 1024, 1024 * 1024 * 1024 * 1024] as const

export const formatFileSize = (bytes: number) => {
    if (bytes < 0) return '0 B'

    for (let i = 0; i < THRESHOLDS.length; i++) {
        if (bytes < THRESHOLDS[i]) {
            const divisor = i === 0 ? 1 : Math.pow(1024, i)
            const value = bytes / divisor
            return i === 0 ? `${Math.floor(value)} ${UNITS[i]}` : `${value.toFixed(1)} ${UNITS[i]}`
        }
    }

    const value = bytes / Math.pow(1024, 4)
    return `${value.toFixed(1)} ${UNITS[4]}`
}
