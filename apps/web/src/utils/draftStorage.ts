/**
 * DUSTGUARD VN — DRAFT STORAGE UTILITY
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
      schema: options?.schema || 'generic_draft',
      version: options?.version || '1.0',
      updatedAt: new Date().toISOString(),
      ttlMs: options?.ttlMs || DEFAULT_TTL_MS,
      owner: options?.owner || 'anonymous',
      data,
    };
    localStorage.setItem(key, JSON.stringify(envelope));
  } catch (err) {
    console.warn('[DraftStorage] Không thể ghi bản nháp vào LocalStorage:', err);
  }
}

export function loadDraft<T>(
  key: string,
  currentOwner?: string
): { data: T; updatedAt: string; owner?: string } | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    const envelope: DraftEnvelope<T> = JSON.parse(raw);
    if (!envelope || !envelope.updatedAt) {
      // Dữ liệu cũ không có envelope, dọn dẹp
      localStorage.removeItem(key);
      return null;
    }

    const age = Date.now() - new Date(envelope.updatedAt).getTime();
    if (age > (envelope.ttlMs || DEFAULT_TTL_MS)) {
      // Đã quá hạn (TTL expired) -> Xóa bản nháp
      console.info(`[DraftStorage] Bản nháp ${key} đã hết hạn (${Math.round(age / 3600000)}h > TTL), tự động dọn dẹp.`);
      localStorage.removeItem(key);
      return null;
    }

    // Owner-scoping (chống rò rỉ bản nháp giữa các tài khoản dùng chung 1 thiết bị/trình duyệt):
    // nếu bản nháp được lưu bởi một chủ sở hữu khác với người đang xem hiện tại, không trả về.
    if (currentOwner && envelope.owner && envelope.owner !== currentOwner) {
      console.info(`[DraftStorage] Bản nháp ${key} thuộc về chủ sở hữu khác, bỏ qua không nạp lại.`);
      return null;
    }

    return {
      data: envelope.data,
      updatedAt: envelope.updatedAt,
      owner: envelope.owner,
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
              // Legacy format without envelope -> remove
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
