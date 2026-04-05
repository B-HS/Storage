import { describe, expect, test } from 'bun:test'

import { validateBeforeUpload } from '@entities/drive/upload'

describe('validateBeforeUpload', () => {
    test('정상 파일은 null을 반환한다', () => {
        const file = new File(['content'], 'test.txt', { type: 'text/plain' })
        expect(validateBeforeUpload(file)).toBeNull()
    })

    test('100MB 초과 파일은 DRIVE_FILE_TOO_LARGE를 반환한다', () => {
        const file = new File([new ArrayBuffer(101 * 1024 * 1024)], 'big.zip')
        expect(validateBeforeUpload(file)).toBe('DRIVE_FILE_TOO_LARGE')
    })

    test('빈 파일은 DRIVE_FILE_EMPTY를 반환한다', () => {
        const file = new File([], 'empty.txt')
        expect(validateBeforeUpload(file)).toBe('DRIVE_FILE_EMPTY')
    })

    test('차단된 확장자는 DRIVE_BLOCKED_EXTENSION을 반환한다', () => {
        const blocked = [
            '.exe',
            '.bat',
            '.cmd',
            '.scr',
            '.msi',
            '.pif',
            '.vbs',
            '.js',
            '.ps1',
            '.sh',
            '.com',
            '.jar',
            '.dll',
            '.wsf',
            '.hta',
            '.cpl',
            '.reg',
        ]
        blocked.forEach((ext) => {
            const file = new File(['x'], `malware${ext}`)
            expect(validateBeforeUpload(file)).toBe('DRIVE_BLOCKED_EXTENSION')
        })
    })

    test('허용된 확장자는 통과한다', () => {
        const allowed = ['.txt', '.pdf', '.png', '.jpg', '.zip', '.mp4']
        allowed.forEach((ext) => {
            const file = new File(['x'], `file${ext}`)
            expect(validateBeforeUpload(file)).toBeNull()
        })
    })
})
