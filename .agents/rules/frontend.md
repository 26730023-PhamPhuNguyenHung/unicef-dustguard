# FILE / IMAGE STORAGE RULES

For DustGuard:
- **D1 stores metadata.**
- **R2 stores binary files.**

DO NOT store normal evidence photos as:
- base64 TEXT
- data URLs
- JSON embedded binary
- large D1 BLOBs

D1 BLOB is allowed only for genuinely tiny binary data when object storage would add unnecessary complexity.

### For user-uploaded evidence:
1. Validate MIME type
2. Validate size
3. Resize/compress when appropriate (Frontend resize/compress WebP/JPEG ~ 1200–1600px display version)
4. Upload binary to R2 (`R2.put()`)
5. Store object key + metadata in D1 (`evidence` table)
6. Never store an absolute public URL as the canonical identifier

**Canonical reference**: `object_key`  
**NOT**: `https://...`  
*(This allows domains, access strategies, and delivery URLs to change without database migration.)*

### Every evidence record should preferably store:
- `id`
- `site_id`
- `case_id`
- `report_id`
- `kind` (photo, document, audio...)
- `object_key`
- `thumbnail_key`
- `original_name`
- `mime_type`
- `size_bytes`
- `width`
- `height`
- `sha256` (SHA-256 fingerprint at upload time for tamper-evidence)
- `latitude`
- `longitude`
- `captured_at`
- `uploaded_by`
- `created_at`

Location/time metadata only when available. Do not fabricate EXIF/geolocation metadata.

---

# BROKEN IMAGE RULE

A broken image icon must NEVER be visible in production UI.

If an image:
- has no object key / URL
- fails loading (`onError`)
- is unauthorized
- was deleted

Render a neutral, clean placeholder. **Do not display browser-native broken image UI.**

### Every image component must implement:
1. **Loading state**: Subtle background or pulse shimmer.
2. **Error fallback**: Neutral placeholder with clean civic/image icon, no red cross or ugly default browser icon.
3. **Fixed aspect ratio**: Prevent layout shifts (Zero CLS).
4. **`object-fit: cover`**: Clean crop without distorting images.
