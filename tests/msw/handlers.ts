import { http, HttpResponse } from 'msw'

import { API_BASE_URL } from '@shared/constant/api'

const BASE = API_BASE_URL

const mockFolders = [
    { id: 'folder-1', userId: 'user-1', parentId: null, name: 'Documents', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
    { id: 'folder-2', userId: 'user-1', parentId: null, name: 'Photos', createdAt: '2026-01-02T00:00:00Z', updatedAt: '2026-01-02T00:00:00Z' },
]

const mockAssets = [
    {
        id: 1,
        originalName: 'readme.txt',
        mimeType: 'text/plain',
        sizeBytes: 420,
        folderId: null,
        isPublic: false,
        thumbnail: null,
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
    },
    {
        id: 2,
        originalName: 'photo.jpg',
        mimeType: 'image/jpeg',
        sizeBytes: 4_800_000,
        folderId: null,
        isPublic: false,
        thumbnail: 'data:image/webp;base64,mock',
        createdAt: '2026-01-02T00:00:00Z',
        updatedAt: '2026-01-02T00:00:00Z',
    },
]

export const handlers = [
    http.get(`${BASE}/api/drive/folders`, () => {
        return HttpResponse.json({ success: true, data: mockFolders })
    }),

    http.get(`${BASE}/api/drive/folders/:folderId`, ({ params }) => {
        const folder = mockFolders.find((f) => f.id === params.folderId)
        if (!folder) return HttpResponse.json({ success: false, error: { code: 'DRIVE_FOLDER_NOT_FOUND', message: 'Not found' } }, { status: 404 })
        return HttpResponse.json({
            success: true,
            data: { ...folder, breadcrumb: [{ id: folder.id, name: folder.name }] },
        })
    }),

    http.post(`${BASE}/api/drive/folders`, async ({ request }) => {
        const body = (await request.json()) as { name: string; parentId?: string }
        const newFolder = {
            id: `folder-${Date.now()}`,
            userId: 'user-1',
            parentId: body.parentId ?? null,
            name: body.name,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }
        return HttpResponse.json({ success: true, data: newFolder }, { status: 201 })
    }),

    http.delete(`${BASE}/api/drive/folders/:folderId`, () => {
        return HttpResponse.json({ success: true, data: null })
    }),

    http.patch(`${BASE}/api/drive/folders/:folderId`, () => {
        return HttpResponse.json({ success: true, data: mockFolders[0] })
    }),

    http.get(`${BASE}/api/drive/assets`, () => {
        return HttpResponse.json({ success: true, data: mockAssets, pagination: { page: 1, limit: 100, total: mockAssets.length } })
    }),

    http.delete(`${BASE}/api/drive/assets/:assetId`, () => {
        return HttpResponse.json({ success: true, data: null })
    }),

    http.patch(`${BASE}/api/drive/assets/:assetId`, () => {
        return HttpResponse.json({ success: true, data: { id: 1 } })
    }),

    http.get(`${BASE}/api/drive/quota`, () => {
        return HttpResponse.json({ success: true, data: { used: 1_000_000, total: 5_368_709_120, remaining: 5_367_709_120 } })
    }),

    http.get(`${BASE}/api/auth/get-session`, () => {
        return HttpResponse.json({
            session: { id: 'sess-1', userId: 'user-1', expiresAt: '2026-12-31T00:00:00Z' },
            user: { id: 'user-1', name: 'Test User', email: 'test@example.com', image: null },
        })
    }),
]
