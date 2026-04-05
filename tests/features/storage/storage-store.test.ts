import { describe, expect, test, beforeEach } from 'bun:test'

import { useStorageStore } from '@shared/store/storage-store'
import type { DriveFolder } from '@entities/drive/type'

const mockFolder: DriveFolder = {
    id: 'folder-1',
    userId: 'user-1',
    name: 'Documents',
    parentId: null,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
}

describe('StorageStore', () => {
    beforeEach(() => {
        const store = useStorageStore.getState()
        store.setCurrentFolderId(null)
        store.clearSelection()
        store.setPreview(null, null)
        store.setDeleteTarget(null)
        store.setRenameTarget(null)
    })

    test('초기 상태가 올바르다', () => {
        const state = useStorageStore.getState()
        expect(state.currentFolderId).toBeNull()
        expect(state.viewMode).toBe('grid')
        expect(state.selectedIds.size).toBe(0)
    })

    test('폴더 네비게이션이 동작한다', () => {
        useStorageStore.getState().setCurrentFolderId('folder-1')
        expect(useStorageStore.getState().currentFolderId).toBe('folder-1')
    })

    test('루트로 돌아간다', () => {
        useStorageStore.getState().setCurrentFolderId('folder-1')
        useStorageStore.getState().setCurrentFolderId(null)
        expect(useStorageStore.getState().currentFolderId).toBeNull()
    })

    test('파일을 선택할 수 있다', () => {
        useStorageStore.getState().select('file-1')
        expect(useStorageStore.getState().selectedIds.has('file-1')).toBe(true)
        expect(useStorageStore.getState().selectedIds.size).toBe(1)
    })

    test('토글 선택이 동작한다', () => {
        useStorageStore.getState().toggleSelect('file-1')
        expect(useStorageStore.getState().selectedIds.has('file-1')).toBe(true)
        useStorageStore.getState().toggleSelect('file-1')
        expect(useStorageStore.getState().selectedIds.has('file-1')).toBe(false)
    })

    test('전체 선택이 동작한다', () => {
        useStorageStore.getState().selectAll(['file-1', 'file-2', 'file-3'])
        expect(useStorageStore.getState().selectedIds.size).toBe(3)
    })

    test('뷰 모드 변경이 동작한다', () => {
        useStorageStore.getState().setViewMode('list')
        expect(useStorageStore.getState().viewMode).toBe('list')
    })

    test('삭제 대상 설정이 동작한다', () => {
        useStorageStore.getState().setDeleteTarget([{ kind: 'folder', data: mockFolder }])
        expect(useStorageStore.getState().deleteTarget).toHaveLength(1)
    })

    test('이름변경 대상 설정이 동작한다', () => {
        useStorageStore.getState().setRenameTarget({ kind: 'folder', data: mockFolder })
        expect(useStorageStore.getState().renameTarget?.data.id).toBe('folder-1')
    })

    test('업로드 큐가 동작한다', () => {
        useStorageStore.getState().addUpload({ id: 'u1', fileName: 'test.txt', progress: 0, status: 'uploading' })
        expect(useStorageStore.getState().uploadQueue).toHaveLength(1)
        useStorageStore.getState().updateUploadProgress('u1', 50)
        expect(useStorageStore.getState().uploadQueue[0].progress).toBe(50)
        useStorageStore.getState().updateUploadStatus('u1', 'done')
        expect(useStorageStore.getState().uploadQueue[0].status).toBe('done')
        useStorageStore.getState().clearCompletedUploads()
        expect(useStorageStore.getState().uploadQueue).toHaveLength(0)
    })
})
