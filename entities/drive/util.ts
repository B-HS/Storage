import type { DriveItem } from './type'

export const getItemId = (item: DriveItem) => (item.kind === 'folder' ? item.data.id : String(item.data.id))
export const getItemName = (item: DriveItem) => (item.kind === 'folder' ? item.data.name : item.data.originalName)
export const isImageAsset = (item: DriveItem) => item.kind === 'asset' && item.data.mimeType.startsWith('image/')
