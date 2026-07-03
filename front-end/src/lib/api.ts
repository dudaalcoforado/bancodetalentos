import type { AuthTokens } from '@/types/auth'
import { tokenStore } from './token-store'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api'

interface BackendEnvelope<T> {
  success: true
  data: T
  timestamp: string
}

interface BackendError {
  statusCode: number
  error: string
  message: string | string[]
  path: string
  timestamp: string
}

export class ApiError extends Error {
  status: number
  details: string[]

  constructor(message: string, status: number, details: string[] = []) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
  auth?: boolean
  skipRefresh?: boolean
}

let refreshPromise: Promise<AuthTokens> | null = null

async function refreshTokens(): Promise<AuthTokens> {
  if (refreshPromise) return refreshPromise

  const refreshToken = tokenStore.getRefresh()
  if (!refreshToken) {
    throw new ApiError('No refresh token available', 401)
  }

  refreshPromise = (async () => {
    const res = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })
    if (!res.ok) {
      tokenStore.clear()
      throw new ApiError('Session expired', res.status)
    }
    const json = (await res.json()) as BackendEnvelope<AuthTokens>
    tokenStore.set(json.data)
    return json.data
  })().finally(() => {
    refreshPromise = null
  })

  return refreshPromise
}

async function parseError(res: Response): Promise<ApiError> {
  let payload: BackendError | null = null
  try {
    payload = (await res.json()) as BackendError
  } catch {
    /* noop */
  }
  const messageRaw = payload?.message ?? res.statusText ?? 'Request failed'
  const details = Array.isArray(messageRaw) ? messageRaw : [messageRaw]
  const message = details[0] ?? 'Request failed'
  return new ApiError(message, res.status, details)
}

function authHeaders(auth: boolean): Record<string, string> {
  if (!auth) return {}
  const access = tokenStore.getAccess()
  return access ? { Authorization: `Bearer ${access}` } : {}
}

async function withAuthRetry(
  path: string,
  options: RequestOptions,
  send: (headers: Record<string, string>) => Promise<Response>,
): Promise<Response> {
  const { auth = true, headers, skipRefresh } = options
  const finalHeaders: Record<string, string> = {
    ...(headers as Record<string, string> | undefined),
    ...authHeaders(auth),
  }

  const res = await send(finalHeaders)

  if (res.status === 401 && auth && !skipRefresh && tokenStore.getRefresh()) {
    try {
      await refreshTokens()
    } catch (err) {
      tokenStore.clear()
      throw err
    }
    return withAuthRetry(path, { ...options, skipRefresh: true }, send)
  }

  return res
}

async function rawRequest<T>(
  path: string,
  options: RequestOptions,
): Promise<T> {
  const { body, ...rest } = options

  const res = await withAuthRetry(path, options, (headers) =>
    fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      headers: {
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
  )

  if (!res.ok) throw await parseError(res)
  if (res.status === 204) return undefined as T

  const json = (await res.json()) as BackendEnvelope<T>
  return json.data
}

async function rawFormRequest<T>(
  path: string,
  formData: FormData,
  options: RequestOptions,
): Promise<T> {
  const res = await withAuthRetry(path, options, (headers) =>
    fetch(`${API_BASE_URL}${path}`, {
      ...options,
      method: 'POST',
      headers,
      body: formData,
    }),
  )

  if (!res.ok) throw await parseError(res)

  const json = (await res.json()) as BackendEnvelope<T>
  return json.data
}

async function rawBlobRequest(
  path: string,
  options: RequestOptions,
): Promise<Blob> {
  const { body: _body, auth: _auth, skipRefresh: _skipRefresh, ...rest } = options
  const res = await withAuthRetry(path, options, (headers) =>
    fetch(`${API_BASE_URL}${path}`, { ...rest, headers }),
  )

  if (!res.ok) throw await parseError(res)
  return res.blob()
}

export const api = {
  get: <T,>(path: string, options: RequestOptions = {}): Promise<T> =>
    rawRequest<T>(path, { ...options, method: 'GET' }),
  post: <T,>(
    path: string,
    body?: unknown,
    options: RequestOptions = {},
  ): Promise<T> => rawRequest<T>(path, { ...options, method: 'POST', body }),
  patch: <T,>(
    path: string,
    body?: unknown,
    options: RequestOptions = {},
  ): Promise<T> => rawRequest<T>(path, { ...options, method: 'PATCH', body }),
  delete: <T,>(path: string, options: RequestOptions = {}): Promise<T> =>
    rawRequest<T>(path, { ...options, method: 'DELETE' }),
  postForm: <T,>(
    path: string,
    formData: FormData,
    options: RequestOptions = {},
  ): Promise<T> => rawFormRequest<T>(path, formData, options),
  getBlob: (path: string, options: RequestOptions = {}): Promise<Blob> =>
    rawBlobRequest(path, { ...options, method: 'GET' }),
}
