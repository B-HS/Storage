export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:9999'
export const UPLOAD_SERVER_URL = process.env.NEXT_PUBLIC_UPLOAD_SERVER_URL ?? API_BASE_URL

export const DRIVE_API_PATH = {
    FOLDERS: '/api/drive/folders',
    FOLDER: (id: string) => `/api/drive/folders/${id}`,
    ASSETS: '/api/drive/assets',
    ASSET: (id: number) => `/api/drive/assets/${id}`,
    QUOTA: '/api/drive/quota',
} as const

export const AUTH_API_PATH = {
    GET_SESSION: '/api/auth/get-session',
    SIGN_OUT: '/api/auth/sign-out',
} as const
