import { describe, expect, test } from 'bun:test'

import { getItemId, getItemName, isImageAsset } from '@entities/drive/util'
import type { DriveItem } from '@entities/drive/type'

const folderItem: DriveItem = {
    kind: 'folder',
    data: { id: 'folder-1', userId: 'u1', parentId: null, name: 'Documents', createdAt: '', updatedAt: '' },
}

const assetItem: DriveItem = {
    kind: 'asset',
    data: {
        id: 42,
        originalName: 'photo.jpg',
        mimeType: 'image/jpeg',
        sizeBytes: 1000,
        folderId: null,
        isPublic: false,
        thumbnail: null,
        createdAt: '',
        updatedAt: '',
    },
}

const textItem: DriveItem = {
    kind: 'asset',
    data: {
        id: 99,
        originalName: 'readme.txt',
        mimeType: 'text/plain',
        sizeBytes: 100,
        folderId: null,
        isPublic: false,
        thumbnail: null,
        createdAt: '',
        updatedAt: '',
    },
}

describe('getItemId', () => {
    test('폴더 ID를 문자열로 반환한다', () => {
        expect(getItemId(folderItem)).toBe('folder-1')
    })

    test('에셋 ID를 문자열로 반환한다', () => {
        expect(getItemId(assetItem)).toBe('42')
    })
})

describe('getItemName', () => {
    test('폴더 이름을 반환한다', () => {
        expect(getItemName(folderItem)).toBe('Documents')
    })

    test('에셋 originalName을 반환한다', () => {
        expect(getItemName(assetItem)).toBe('photo.jpg')
    })
})

describe('isImageAsset', () => {
    test('이미지 에셋을 감지한다', () => {
        expect(isImageAsset(assetItem)).toBe(true)
    })

    test('텍스트 에셋은 false를 반환한다', () => {
        expect(isImageAsset(textItem)).toBe(false)
    })

    test('폴더는 false를 반환한다', () => {
        expect(isImageAsset(folderItem)).toBe(false)
    })
})
