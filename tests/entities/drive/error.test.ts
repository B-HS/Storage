import { describe, expect, test } from 'bun:test'

import { getDriveErrorMessage, isUnauthorizedError } from '@entities/drive/error'
import { ko } from '@shared/i18n/ko'

describe('getDriveErrorMessage', () => {
    test('알려진 에러 코드를 i18n 메시지로 변환한다', () => {
        const error = { success: false, error: { code: 'DRIVE_FILE_TOO_LARGE', message: 'server msg' } }
        expect(getDriveErrorMessage(error, ko)).toBe(ko.errorFileTooLarge)
    })

    test('DRIVE_QUOTA_EXCEEDED를 올바르게 변환한다', () => {
        const error = { success: false, error: { code: 'DRIVE_QUOTA_EXCEEDED', message: 'server msg' } }
        expect(getDriveErrorMessage(error, ko)).toBe(ko.errorQuotaExceeded)
    })

    test('DRIVE_DUPLICATE_FILE를 올바르게 변환한다', () => {
        const error = { success: false, error: { code: 'DRIVE_DUPLICATE_FILE', message: 'server msg' } }
        expect(getDriveErrorMessage(error, ko)).toBe(ko.errorDuplicateFile)
    })

    test('알려지지 않은 에러 코드는 서버 메시지를 반환한다', () => {
        const error = { success: false, error: { code: 'SOME_UNKNOWN_CODE', message: 'Custom message' } }
        expect(getDriveErrorMessage(error, ko)).toBe('Custom message')
    })

    test('에러 구조가 없으면 errorUnknown을 반환한다', () => {
        expect(getDriveErrorMessage({}, ko)).toBe(ko.errorUnknown)
        expect(getDriveErrorMessage(null, ko)).toBe(ko.errorUnknown)
    })
})

describe('isUnauthorizedError', () => {
    test('UNAUTHORIZED 에러를 감지한다', () => {
        const error = { success: false, error: { code: 'UNAUTHORIZED', message: '' } }
        expect(isUnauthorizedError(error)).toBe(true)
    })

    test('다른 에러는 false를 반환한다', () => {
        const error = { success: false, error: { code: 'DRIVE_FILE_TOO_LARGE', message: '' } }
        expect(isUnauthorizedError(error)).toBe(false)
    })
})
