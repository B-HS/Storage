import { describe, expect, test } from 'bun:test'

import { folderListOptions, folderDetailOptions, assetListOptions, quotaOptions } from '@entities/drive/query-options'

describe('queryOptions - staleTime 설정', () => {
    test('folderListOptions에 staleTime 30초가 설정되어 있다', () => {
        const options = folderListOptions('u1')
        expect(options.staleTime).toBe(30_000)
    })

    test('folderDetailOptions에 staleTime 30초가 설정되어 있다', () => {
        const options = folderDetailOptions('u1', 'folder1')
        expect(options.staleTime).toBe(30_000)
    })

    test('assetListOptions에 staleTime 30초가 설정되어 있다', () => {
        const options = assetListOptions('u1', { folderId: 'root' })
        expect(options.staleTime).toBe(30_000)
    })

    test('quotaOptions에 staleTime 60초가 설정되어 있다', () => {
        const options = quotaOptions('u1')
        expect(options.staleTime).toBe(60_000)
    })
})

describe('queryOptions - queryKey 구조', () => {
    test('folderListOptions는 parentId를 키에 포함한다', () => {
        const withParent = folderListOptions('u1', 'parent1')
        const withoutParent = folderListOptions('u1')

        expect(withParent.queryKey).toContain('parent1')
        expect(withoutParent.queryKey).toContain('root')
    })

    test('assetListOptions는 params를 키에 포함한다', () => {
        const params = { folderId: 'f1', page: 2, limit: 20 }
        const options = assetListOptions('u1', params)

        expect(options.queryKey).toContainEqual(params)
    })
})
