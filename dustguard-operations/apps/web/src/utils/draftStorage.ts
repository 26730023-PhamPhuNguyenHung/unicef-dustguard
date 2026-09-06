/**
 * DUSTGUARD VN — DRAFT STORAGE UTILITY (OPERATIONS)
 * Quản lý bản nháp có cấu trúc, TTL giới hạn thời gian lưu và tự động dọn dẹp (Section 21-23)
 * Tuyệt đối không lưu dữ liệu binary/base64 ảnh vào LocalStorage
 */

export interface DraftEnvelope<T = any> {
  schema: string;
  version: string;
  updatedAt: string;
  ttlMs: number;
  owner?: string;
  data: T;
}

const DEFAULT_TTL_MS = 7 * 24 * 60 * 60 * 1000; // Mặc định 7 ngày

export function saveDraft<T>(
  key: string,
  data: T,
  options?: { schema?: string; version?: string; ttlMs?: number; owner?: string }
): void {
  try {
    const envelope: DraftEnvelope<T> = {
      schema: options?.schema || 'operations_draft',
      version: options?.version || '1.0',
      updatedAt: new Date().toISOString(),
      ttlMs: options?.ttlMs || DEFAULT_TTL_MS,
      owner: options?.owner || 'staff',
      data,
    };
    localStorage.setItem(key, JSON.stringify(envelope));
  } catch (err) {
    console.warn('[DraftStorage] Không thể ghi bản nháp vào LocalStorage:', err);
  }
}

export function loadDraft<T>(key: string, expectedOwner?: string): { data: T; updatedAt: string } | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    const envelope: DraftEnvelope<T> = JSON.parse(raw);
    if (!envelope || !envelope.updatedAt) {
      localStorage.removeItem(key);
      return null;
    }

    const age = Date.now() - new Date(envelope.updatedAt).getTime();
    if (age > (envelope.ttlMs || DEFAULT_TTL_MS)) {
      console.info(`[DraftStorage] Bản nháp ${key} đã hết hạn, tự động dọn dẹp.`);
      localStorage.removeItem(key);
      return null;
    }

    // Owner-scoped: on a shared machine, never surface a draft belonging to a
    // different logged-in user than the one who wrote it.
    if (expectedOwner && envelope.owner && envelope.owner !== expectedOwner) {
      return null;
    }

    return {
      data: envelope.data,
      updatedAt: envelope.updatedAt,
    };
  } catch (err) {
    console.warn('[DraftStorage] Lỗi khi đọc bản nháp:', err);
    try { localStorage.removeItem(key); } catch {}
    return null;
  }
}

export function clearDraft(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {}
}

export function cleanupExpiredDrafts(): number {
  let cleaned = 0;
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('dustguard_draft_')) {
        const raw = localStorage.getItem(k);
        if (raw) {
          try {
            const env = JSON.parse(raw);
            if (env?.updatedAt) {
              const age = Date.now() - new Date(env.updatedAt).getTime();
              if (age > (env.ttlMs || DEFAULT_TTL_MS)) {
                keysToRemove.push(k);
              }
            } else {
              keysToRemove.push(k);
            }
          } catch {
            keysToRemove.push(k);
          }
        }
      }
    }
    for (const k of keysToRemove) {
      localStorage.removeItem(k);
      cleaned++;
    }
  } catch (err) {
    console.warn('[DraftStorage] Lỗi trong quá trình dọn dẹp định kỳ:', err);
  }
  return cleaned;
}
