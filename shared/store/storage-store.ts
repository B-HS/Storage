import { create } from 'zustand'
import type { DriveAsset, DriveItem, DriveSortField, DriveSortOrder } from '@entities/drive/type'

export type ViewMode = 'grid' | 'list'
export type ZoomLevel = 1 | 2 | 3 | 4 | 5

type UploadItem = {
    id: string
    fileName: string
    progress: number
    status: 'pending' | 'uploading' | 'done' | 'error'
    error?: string
}

const ZOOM_STORAGE_KEY = 'storage-zoom-level'

const getInitialZoom = () => {
    if (typeof window === 'undefined') return 3
    const stored = localStorage.getItem(ZOOM_STORAGE_KEY)
    if (stored) {
        const parsed = Number(stored)
        if (parsed >= 1 && parsed <= 5) return parsed as ZoomLevel
        localStorage.removeItem(ZOOM_STORAGE_KEY)
    }
    return 3
}

type StorageStore = {
    currentFolderId: string | null
    setCurrentFolderId: (id: string | null) => void

    viewMode: ViewMode
    setViewMode: (mode: ViewMode) => void
    zoomLevel: ZoomLevel
    setZoomLevel: (level: ZoomLevel) => void

    sortField: DriveSortField
    sortOrder: DriveSortOrder
    setSortField: (field: DriveSortField) => void
    setSortOrder: (order: DriveSortOrder) => void
    mimeFilter: string | null
    setMimeFilter: (filter: string | null) => void

    page: number
    setPage: (page: number) => void

    selectedIds: Set<string>
    select: (id: string) => void
    toggleSelect: (id: string) => void
    selectAll: (ids: string[]) => void
    clearSelection: () => void
    isSelected: (id: string) => boolean

    detailItem: DriveItem | null
    setDetailItem: (item: DriveItem | null) => void

    previewAsset: DriveAsset | null
    previewUrl: string | null
    setPreview: (asset: DriveAsset | null, url: string | null) => void
    deleteTarget: DriveItem[] | null
    setDeleteTarget: (items: DriveItem[] | null) => void
    renameTarget: DriveItem | null
    setRenameTarget: (item: DriveItem | null) => void

    uploadQueue: UploadItem[]
    addUpload: (item: UploadItem) => void
    updateUploadProgress: (id: string, progress: number) => void
    updateUploadStatus: (id: string, status: UploadItem['status'], error?: string) => void
    removeUpload: (id: string) => void
    clearCompletedUploads: () => void
}

export const useStorageStore = create<StorageStore>((set, get) => ({
    currentFolderId: null,
    setCurrentFolderId: (id) => set({ currentFolderId: id, selectedIds: new Set(), detailItem: null, page: 1 }),

    viewMode: 'grid',
    setViewMode: (mode) => set({ viewMode: mode }),
    zoomLevel: getInitialZoom(),
    setZoomLevel: (level) => {
        localStorage.setItem(ZOOM_STORAGE_KEY, String(level))
        set({ zoomLevel: level })
    },

    sortField: 'created',
    sortOrder: 'desc',
    setSortField: (field) => set({ sortField: field, page: 1 }),
    setSortOrder: (order) => set({ sortOrder: order, page: 1 }),
    mimeFilter: null,
    setMimeFilter: (filter) => set({ mimeFilter: filter, page: 1 }),

    page: 1,
    setPage: (page) => set({ page }),

    selectedIds: new Set(),
    select: (id) => set({ selectedIds: new Set([id]) }),
    toggleSelect: (id) =>
        set((state) => {
            const next = new Set(state.selectedIds)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return { selectedIds: next }
        }),
    selectAll: (ids) => set({ selectedIds: new Set(ids) }),
    clearSelection: () => set({ selectedIds: new Set(), detailItem: null }),
    isSelected: (id) => get().selectedIds.has(id),

    detailItem: null,
    setDetailItem: (item) => set({ detailItem: item }),

    previewAsset: null,
    previewUrl: null,
    setPreview: (asset, url) => set({ previewAsset: asset, previewUrl: url }),
    deleteTarget: null,
    setDeleteTarget: (items) => set({ deleteTarget: items }),
    renameTarget: null,
    setRenameTarget: (item) => set({ renameTarget: item }),

    uploadQueue: [],
    addUpload: (item) => set((state) => ({ uploadQueue: [...state.uploadQueue, item] })),
    updateUploadProgress: (id, progress) =>
        set((state) => ({
            uploadQueue: state.uploadQueue.map((u) => (u.id === id ? { ...u, progress } : u)),
        })),
    updateUploadStatus: (id, status, error) =>
        set((state) => ({
            uploadQueue: state.uploadQueue.map((u) => (u.id === id ? { ...u, status, error } : u)),
        })),
    removeUpload: (id) => set((state) => ({ uploadQueue: state.uploadQueue.filter((u) => u.id !== id) })),
    clearCompletedUploads: () => set((state) => ({ uploadQueue: state.uploadQueue.filter((u) => u.status !== 'done') })),
}))
