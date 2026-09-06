export const MIME_MAP: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
  svg: 'image/svg+xml',
  heic: 'image/heic',
  pdf: 'application/pdf',
  json: 'application/json',
  txt: 'text/plain'
};

export async function sha256Hex(buffer: ArrayBuffer): Promise<string> {
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function getMimeType(fileName: string, defaultType: string = 'application/octet-stream'): string {
  const ext = fileName.split('.').pop()?.toLowerCase();
  return (ext && MIME_MAP[ext]) || defaultType;
}

export async function putObject(
  bucket: any,
  key: string,
  data: ArrayBuffer | Uint8Array,
  mimeType: string,
  customMetadata: Record<string, string> = {}
): Promise<{ key: string; sha256: string; size: number }> {
  const sha256 = await sha256Hex(data instanceof ArrayBuffer ? data : data.buffer);
  await bucket.put(key, data, {
    httpMetadata: {
      contentType: mimeType,
      cacheControl: 'public, max-age=31536000, immutable'
    },
    customMetadata: {
      sha256,
      ...customMetadata
    }
  });
  return {
    key,
    sha256,
    size: data.byteLength
  };
}

export async function getObject(bucket: any, key: string): Promise<Response | null> {
  if (!bucket || !key) return null;
  const obj = await bucket.get(key);
  if (!obj) return null;

  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set('etag', obj.httpEtag);
  headers.set('Cache-Control', 'public, max-age=86400');
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('X-Content-Type-Options', 'nosniff');

  const ext = key.split('.').pop()?.toLowerCase();
  if (ext && MIME_MAP[ext] && !headers.get('content-type')) {
    headers.set('Content-Type', MIME_MAP[ext]);
  }

  return new Response(obj.body, { headers });
}
