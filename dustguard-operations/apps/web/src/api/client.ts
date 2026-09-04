export interface ApiError {
  type?: string;
  title: string;
  status: number;
  detail: string;
  invalidParams?: any[];
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('dustguard_token');
  const devUserId = localStorage.getItem('dustguard_dev_user_id');

  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (devUserId) {
    headers.set('x-user-id', devUserId);
  }

  const res = await fetch(endpoint, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let errorData: any = {};
    try {
      errorData = await res.json();
    } catch {
      errorData = { title: 'Lỗi máy chủ', detail: res.statusText };
    }

    const error: ApiError = {
      title: errorData.title || 'Lỗi xử lý',
      status: res.status,
      detail: errorData.detail || errorData.error || 'Đã có lỗi xảy ra',
      invalidParams: errorData.invalidParams,
    };
    throw error;
  }

  return res.json() as Promise<T>;
}

export const api = {
  auth: {
    login: (body: { username: string; password: string }) =>
      request<{ user: any; token: string; permissions: string[] }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    me: () => request<{ user: any; permissions: string[] }>('/api/auth/me'),
    logout: () => request<{ success: boolean }>('/api/auth/logout', { method: 'POST' }),
  },

  dashboard: {
    get: () => request<any>('/api/dashboard'),
  },

  cases: {
    list: (params: Record<string, string | undefined> = {}) => {
      const sp = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== '') sp.append(k, v);
      });
      return request<{ cases: any[]; total: number }>(`/api/cases?${sp.toString()}`);
    },
    get: (id: string) => request<any>(`/api/cases/${id}`),
    create: (data: any) =>
      request<{ case: any }>('/api/cases', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      request<{ case: any }>(`/api/cases/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    transition: (id: string, data: any) =>
      request<{ success: boolean; case: any; message: string }>(`/api/cases/${id}/transition`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    assign: (id: string, data: any) =>
      request<{ success: boolean; case: any }>(`/api/cases/${id}/assign`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    reassign: (id: string, data: any) =>
      request<{ success: boolean; case: any }>(`/api/cases/${id}/reassign`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    close: (id: string, data: any) =>
      request<{ success: boolean; closure: any; message: string }>(`/api/cases/${id}/close`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    reopen: (id: string, data: any) =>
      request<{ success: boolean; message: string }>(`/api/cases/${id}/reopen`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  legal: {
    search: (q: string) => request<{ query: string; results: any[]; total: number }>(`/api/legal/search?q=${encodeURIComponent(q)}`),
    documents: () => request<{ documents: any[] }>('/api/legal/documents'),
    document: (id: string) => request<{ document: any; sections: any[] }>(`/api/legal/documents/${id}`),
    analyze: (caseId: string) =>
      request<{ analysis: any }>(`/api/cases/${caseId}/legal/analyze`, { method: 'POST' }),
    analyses: (caseId: string) => request<{ analyses: any[] }>(`/api/cases/${caseId}/legal/analyses`),
    review: (caseId: string, data: any) =>
      request<{ success: boolean; review: any }>(`/api/cases/${caseId}/legal/review`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  inspections: {
    templates: () => request<{ templates: any[] }>('/api/inspection-templates'),
    list: (params: Record<string, string | undefined> = {}) => {
      const sp = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v) sp.append(k, v);
      });
      return request<{ inspections: any[] }>(`/api/inspections?${sp.toString()}`);
    },
    get: (id: string) => request<{ inspection: any; items: any[]; findings: any[] }>(`/api/inspections/${id}`),
    create: (caseId: string, data: any) =>
      request<{ inspection: any }>(`/api/cases/${caseId}/inspections`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    updateDraft: (id: string, data: any) =>
      request<{ success: boolean; inspection: any }>(`/api/inspections/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    submit: (id: string, data: any) =>
      request<{ success: boolean; message: string }>(`/api/inspections/${id}/submit`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  findings: {
    list: (params: Record<string, string | undefined> = {}) => {
      const sp = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v) sp.append(k, v);
      });
      return request<{ findings: any[] }>(`/api/findings?${sp.toString()}`);
    },
    create: (inspectionId: string, data: any) =>
      request<{ finding: any }>(`/api/inspections/${inspectionId}/findings`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  actions: {
    list: (params: Record<string, string | undefined> = {}) => {
      const sp = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v) sp.append(k, v);
      });
      return request<{ actions: any[] }>(`/api/actions?${sp.toString()}`);
    },
    create: (caseId: string, data: any) =>
      request<{ action: any }>(`/api/cases/${caseId}/actions`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      request<{ action: any }>(`/api/actions/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    submitRemediation: (actionId: string, data: any) =>
      request<{ submission: any }>(`/api/actions/${actionId}/remediation`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    reviewRemediation: (submissionId: string, data: any) =>
      request<{ success: boolean; submission: any }>(`/api/remediation/${submissionId}/review`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  evidence: {
    list: (caseId: string) => request<{ evidence: any[] }>(`/api/cases/${caseId}/evidence`),
    upload: (caseId: string, file: File, sourceType: string = 'CASE', sourceId?: string) => {
      const formData = new FormData();
      formData.append('case_id', caseId);
      formData.append('source_type', sourceType);
      if (sourceId) formData.append('source_id', sourceId);
      formData.append('file', file);
      return request<{ asset: any }>('/api/evidence/upload', {
        method: 'POST',
        body: formData,
      });
    },
  },

  notifications: {
    list: () => request<{ notifications: any[]; unreadCount: number }>('/api/notifications'),
    markRead: (id: string) => request<{ success: boolean }>(`/api/notifications/${id}/read`, { method: 'POST' }),
  },

  admin: {
    users: () => request<{ users: any[] }>('/api/admin/users'),
    updateUser: (id: string, data: any) =>
      request<{ user: any }>(`/api/admin/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    audit: (params: Record<string, string | undefined> = {}) => {
      const sp = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v) sp.append(k, v);
      });
      return request<{ logs: any[] }>(`/api/admin/audit?${sp.toString()}`);
    },
  },
};
