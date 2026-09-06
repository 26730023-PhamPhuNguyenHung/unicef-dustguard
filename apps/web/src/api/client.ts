import { ApiResponse } from '@dustguard/shared';

const API_BASE = '/api';

export class ApiError extends Error {
  code: string;
  status?: number;
  constructor(message: string, code: string = 'ERROR', status?: number) {
    super(message);
    this.code = code;
    this.status = status;
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

    let data: any;
    try {
      data = await response.json();
    } catch {
      throw new ApiError(
        response.status >= 500 ? 'Hệ thống đang gặp sự cố. Vui lòng thử lại sau.' : 'Phản hồi từ máy chủ không hợp lệ.',
        'PARSE_ERROR',
        response.status
      );
    }

    if (!response.ok || !data.success) {
      throw new ApiError(
        data.error?.message || data.detail || data.title || 'Đã xảy ra lỗi khi gọi máy chủ.',
        data.error?.code || data.code || 'HTTP_ERROR',
        response.status
      );
    }

    return (data.data !== undefined ? data.data : data) as T;
  } catch (err: any) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(err.message || 'Không thể kết nối tới máy chủ.', 'NETWORK_ERROR');
  }
}
