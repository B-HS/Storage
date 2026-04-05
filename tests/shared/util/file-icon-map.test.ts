import { describe, expect, test } from 'bun:test'

import { getFileIcon, isImageFile } from '@shared/util/file-icon-map'

describe('getFileIcon', () => {
    test('이미지 확장자에 대해 isImage가 true이다', () => {
        expect(getFileIcon('photo.jpg').isImage).toBe(true)
        expect(getFileIcon('image.png').isImage).toBe(true)
        expect(getFileIcon('anim.gif').isImage).toBe(true)
        expect(getFileIcon('photo.webp').isImage).toBe(true)
        expect(getFileIcon('icon.svg').isImage).toBe(true)
    })

    test('비이미지 확장자에 대해 isImage가 false이다', () => {
        expect(getFileIcon('doc.pdf').isImage).toBe(false)
        expect(getFileIcon('code.ts').isImage).toBe(false)
        expect(getFileIcon('data.json').isImage).toBe(false)
        expect(getFileIcon('archive.zip').isImage).toBe(false)
    })

    test('알 수 없는 확장자는 기본 아이콘을 반환한다', () => {
        const result = getFileIcon('unknown.xyz')
        expect(result.isImage).toBe(false)
    })

    test('확장자가 없는 파일은 기본 아이콘을 반환한다', () => {
        const result = getFileIcon('Makefile')
        expect(result.isImage).toBe(false)
    })
})

describe('isImageFile', () => {
    test('이미지 파일을 올바르게 판별한다', () => {
        expect(isImageFile('photo.jpg')).toBe(true)
        expect(isImageFile('readme.txt')).toBe(false)
    })

    test('대소문자를 구분하지 않는다', () => {
        expect(isImageFile('photo.JPG')).toBe(true)
        expect(isImageFile('photo.Png')).toBe(true)
    })
})
