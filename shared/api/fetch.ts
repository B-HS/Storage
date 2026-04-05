'use server'

import { cookies } from 'next/headers'
import { API_BASE_URL } from '@shared/constant/api'

type ApiSuccessResponse<T> = { success: true; data: T }
type ApiPaginatedResponse<T> = { success: true; data: T[]; pagination: { page: number; limit: number; total: number } }
type ApiErrorResponse = { success: false; error: { code: string; message: string } }

export const baseFetch = async (path: string, init?: RequestInit) => {
    const cookieStore = await cookies()
    const cookieHeader = cookieStore.toString()

    return fetch(`${API_BASE_URL}${path}`, {
        ...init,
        headers: {
            'Content-Type': 'application/json',
            'Cookie': cookieHeader,
            ...init?.headers,
        },
        credentials: 'include',
    })
}

const parseJson = async <T>(res: Response) => {
    const json = await res.json()
    if (!json.success) throw json as ApiErrorResponse
    return json as T
}

export const serverFetch = async <T>(path: string, init?: RequestInit) => {
    const res = await baseFetch(path, init)
    const json = await parseJson<ApiSuccessResponse<T>>(res)
    return json.data
}

export const serverFetchPaginated = async <T>(path: string, init?: RequestInit) => {
    const res = await baseFetch(path, init)
    const json = await parseJson<ApiPaginatedResponse<T>>(res)
    return { data: json.data, pagination: json.pagination }
}
