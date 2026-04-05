import { describe, expect, test, beforeEach } from 'bun:test'

import { useStorageStore } from '@shared/store/storage-store'

describe('StorageStore - Sort/Filter/Page', () => {
    beforeEach(() => {
        const store = useStorageStore.getState()
        store.setCurrentFolderId(null)
        store.clearSelection()
        store.setSortField('created')
        store.setSortOrder('desc')
        store.setMimeFilter(null)
        store.setPage(1)
    })

    test('기본 정렬은 created desc이다', () => {
        const state = useStorageStore.getState()
        expect(state.sortField).toBe('created')
        expect(state.sortOrder).toBe('desc')
    })

    test('정렬 필드를 변경하면 page가 1로 리셋된다', () => {
        useStorageStore.getState().setPage(3)
        useStorageStore.getState().setSortField('name')
        expect(useStorageStore.getState().sortField).toBe('name')
        expect(useStorageStore.getState().page).toBe(1)
    })

    test('정렬 순서를 변경하면 page가 1로 리셋된다', () => {
        useStorageStore.getState().setPage(3)
        useStorageStore.getState().setSortOrder('asc')
        expect(useStorageStore.getState().sortOrder).toBe('asc')
        expect(useStorageStore.getState().page).toBe(1)
    })

    test('MIME 필터를 설정하면 page가 1로 리셋된다', () => {
        useStorageStore.getState().setPage(3)
        useStorageStore.getState().setMimeFilter('image/')
        expect(useStorageStore.getState().mimeFilter).toBe('image/')
        expect(useStorageStore.getState().page).toBe(1)
    })

    test('MIME 필터를 null로 해제할 수 있다', () => {
        useStorageStore.getState().setMimeFilter('image/')
        useStorageStore.getState().setMimeFilter(null)
        expect(useStorageStore.getState().mimeFilter).toBeNull()
    })

    test('페이지를 변경할 수 있다', () => {
        useStorageStore.getState().setPage(5)
        expect(useStorageStore.getState().page).toBe(5)
    })

    test('폴더 이동 시 page가 1로 리셋된다', () => {
        useStorageStore.getState().setPage(3)
        useStorageStore.getState().setCurrentFolderId('folder-1')
        expect(useStorageStore.getState().page).toBe(1)
    })
})
