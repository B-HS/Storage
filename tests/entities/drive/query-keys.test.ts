import { describe, expect, test } from 'bun:test'

import { DRIVE_QUERY_KEY } from '@entities/drive/query-options'

describe('DRIVE_QUERY_KEY - 계층 구조', () => {
    test('all 키가 폴더/에셋 키의 prefix이다', () => {
        const all = [...DRIVE_QUERY_KEY.all('u1')]
        const folders = [...DRIVE_QUERY_KEY.folders('u1')]
        const assets = [...DRIVE_QUERY_KEY.assets('u1')]

        expect(folders.slice(0, all.length)).toEqual(all)
        expect(assets.slice(0, all.length)).toEqual(all)
    })

    test('invalidateQueries에서 all로 모든 하위 키를 무효화할 수 있다', () => {
        const all = [...DRIVE_QUERY_KEY.all('u1')]
        const folderList = [...DRIVE_QUERY_KEY.folderList('u1', 'parent')]
        const assetList = [...DRIVE_QUERY_KEY.assetList('u1', { folderId: 'root' })]
        const quota = [...DRIVE_QUERY_KEY.quota('u1')]

        expect(folderList.slice(0, all.length)).toEqual(all)
        expect(assetList.slice(0, all.length)).toEqual(all)
        expect(quota.slice(0, all.length)).toEqual(all)
    })
})
