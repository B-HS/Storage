import { describe, expect, test } from 'bun:test'

import { formatFileSize } from '@shared/util/format-file-size'

describe('formatFileSize', () => {
    test('0 바이트를 올바르게 포맷한다', () => {
        expect(formatFileSize(0)).toBe('0 B')
    })

    test('음수를 0 B로 반환한다', () => {
        expect(formatFileSize(-100)).toBe('0 B')
    })

    test('1KB 미만은 B로 표시한다', () => {
        expect(formatFileSize(512)).toBe('512 B')
        expect(formatFileSize(1023)).toBe('1023 B')
    })

    test('2MB 미만은 KB로 표시한다', () => {
        expect(formatFileSize(1024)).toBe('1.0 KB')
        expect(formatFileSize(1536)).toBe('1.5 KB')
        expect(formatFileSize(2_097_151)).toBe('2048.0 KB')
    })

    test('1GB 미만은 MB로 표시한다', () => {
        expect(formatFileSize(2_097_152)).toBe('2.0 MB')
        expect(formatFileSize(52_000_000)).toBe('49.6 MB')
    })

    test('1TB 미만은 GB로 표시한다', () => {
        expect(formatFileSize(1_073_741_824)).toBe('1.0 GB')
        expect(formatFileSize(5_368_709_120)).toBe('5.0 GB')
    })

    test('1TB 이상은 TB로 표시한다', () => {
        expect(formatFileSize(1_099_511_627_776)).toBe('1.0 TB')
    })
})
