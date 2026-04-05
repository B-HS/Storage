import { describe, expect, test } from 'bun:test'

describe('download 관련 유틸', () => {
    test('downloadAsset은 export 되어있다', async () => {
        const mod = await import('@entities/drive/download')
        expect(typeof mod.downloadAsset).toBe('function')
    })
})
