/**
 * Tiện ích tính mã băm SHA-256 cho file sử dụng Web Crypto API chuẩn trình duyệt
 */
export async function calculateFileSha256(file: File): Promise<string> {
  try {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (err) {
    console.warn('Lỗi tính SHA-256 qua Web Crypto, sử dụng timestamp fallback:', err);
    return `sha256_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
  }
}
