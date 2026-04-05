import { describe, expect, test } from 'bun:test'

import { DRIVE_QUERY_KEY, folderListOptions, assetListOptions, quotaOptions, folderDetailOptions } from '@entities/drive/query-options'

describe('DRIVE_QUERY_KEY', () => {
    test('all 키에 userId가 포함된다', () => {
        expect(DRIVE_QUERY_KEY.all('user-123')).toEqual(['drive', 'user-123'])
    })

    test('folders 키가 올바르다', () => {
        expect(DRIVE_QUERY_KEY.folders('user-1')).toEqual(['drive', 'user-1', 'folders'])
    })

    test('folderList 키에 parentId가 포함된다', () => {
        expect(DRIVE_QUERY_KEY.folderList('user-1', 'parent-1')).toEqual(['drive', 'user-1', 'folders', 'list', 'parent-1'])
    })

    test('folderList 키에 parentId 없으면 root', () => {
        expect(DRIVE_QUERY_KEY.folderList('user-1')).toEqual(['drive', 'user-1', 'folders', 'list', 'root'])
    })

    test('folderDetail 키가 올바르다', () => {
        expect(DRIVE_QUERY_KEY.folderDetail('user-1', 'folder-1')).toEqual(['drive', 'user-1', 'folders', 'detail', 'folder-1'])
    })

    test('assetList 키에 params가 포함된다', () => {
        const params = { folderId: 'root', page: 2 }
        const key = DRIVE_QUERY_KEY.assetList('user-1', params)
        expect(key).toEqual(['drive', 'user-1', 'assets', 'list', params])
    })

    test('assetDetail 키가 올바르다', () => {
        expect(DRIVE_QUERY_KEY.assetDetail('user-1', 42)).toEqual(['drive', 'user-1', 'assets', 'detail', 42])
    })

    test('quota 키가 올바르다', () => {
        expect(DRIVE_QUERY_KEY.quota('user-1')).toEqual(['drive', 'user-1', 'quota'])
    })
})

describe('queryOptions', () => {
    test('folderListOptions의 queryKey에 userId와 parentId가 포함된다', () => {
        const opts = folderListOptions('user-1', 'parent-1')
        expect(opts.queryKey).toContain('user-1')
        expect(opts.queryKey).toContain('parent-1')
    })

    test('folderDetailOptions의 queryKey에 folderId가 포함된다', () => {
        const opts = folderDetailOptions('user-1', 'folder-1')
        expect(opts.queryKey).toContain('folder-1')
    })

    test('assetListOptions의 queryKey에 userId가 포함된다', () => {
        const opts = assetListOptions('user-1', { folderId: 'root' })
        expect(opts.queryKey).toContain('user-1')
    })

    test('quotaOptions의 queryKey에 userId가 포함된다', () => {
        const opts = quotaOptions('user-1')
        expect(opts.queryKey).toContain('user-1')
        expect(opts.queryKey).toContain('quota')
    })

    test('서로 다른 userId는 다른 queryKey를 생성한다', () => {
        const a = folderListOptions('user-a')
        const b = folderListOptions('user-b')
        expect(a.queryKey).toContain('user-a')
        expect(b.queryKey).toContain('user-b')
        expect(a.queryKey).not.toContain('user-b')
    })

    test('queryFn이 정의되어 있다', () => {
        expect(folderListOptions('u').queryFn).toBeDefined()
        expect(folderDetailOptions('u', 'f').queryFn).toBeDefined()
        expect(assetListOptions('u', {}).queryFn).toBeDefined()
        expect(quotaOptions('u').queryFn).toBeDefined()
    })
})
