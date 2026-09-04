import { ApiResponse } from '@dustguard/shared';

const API_BASE = '/api';

export class ApiError extends Error {
  code: string;
  constructor(message: string, code: string = 'ERROR') {
    super(message);
    this.code = code;
    this.name = 'ApiError';
  }
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('dustguard_token');
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    const data: ApiResponse<T> = await response.json();

    if (!response.ok || !data.success) {
      throw new ApiError(data.error?.message || 'Đã xảy ra lỗi khi gọi máy chủ.', data.error?.code || 'HTTP_ERROR');
    }

    return data.data as T;
  } catch (err: any) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(err.message || 'Không thể kết nối tới máy chủ.', 'NETWORK_ERROR');
  }
}
