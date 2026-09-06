import { Router, Response } from 'express';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { get, query, run } from '../../db/connection.js';
import { AuthRequest, requireAuth } from '../../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '../../..');
const UPLOADS_DIR = path.join(PROJECT_ROOT, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `evd-${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext}`;
    cb(null, uniqueName);
  },
});

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
  'video/mp4',
  'video/quicktime',
  'video/webm',
  'application/pdf',
]);

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB max
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      const err: any = new Error('Định dạng tệp không được hỗ trợ. Chỉ chấp nhận ảnh, video hoặc PDF làm bằng chứng.');
      err.status = 400;
      cb(err);
      return;
    }
    cb(null, true);
  },
});

export const evidenceRouter = Router();

// 1. GET /api/evidence - Centralized evidence listing with search & filters
evidenceRouter.get('/', requireAuth, (req, res) => {
  const { case_id, source_type, q, limit = '50', offset = '0' } = req.query as Record<string, string | undefined>;

  let sql = `
    SELECT ea.*, u.full_name as uploaded_by_name, c.case_code, c.title as case_title
    FROM evidence_assets ea
    LEFT JOIN users u ON ea.uploaded_by = u.id
    LEFT JOIN cases c ON ea.case_id = c.id
    WHERE 1=1
  `;
  const params: any[] = [];

  if (case_id) {
    sql += ` AND ea.case_id = ?`;
    params.push(case_id);
  }

  if (source_type && source_type !== 'ALL') {
    sql += ` AND ea.source_type = ?`;
    params.push(source_type);
  }

  if (q && q.trim()) {
    sql += ` AND (ea.file_name LIKE ? OR c.case_code LIKE ? OR c.title LIKE ?)`;
    const pattern = `%${q.trim()}%`;
    params.push(pattern, pattern, pattern);
  }

  sql += ` ORDER BY ea.created_at DESC LIMIT ? OFFSET ?`;
  params.push(parseInt(limit, 10) || 50, parseInt(offset, 10) || 0);

  const evidence = query<any>(sql, params);
  const totalCount = get<{ count: number }>(
    `SELECT count(*) as count FROM evidence_assets ea WHERE 1=1 ${case_id ? 'AND ea.case_id = ?' : ''}`,
    case_id ? [case_id] : []
  )?.count || evidence.length;

  res.json({
    success: true,
    evidence,
    data: evidence,
    total: totalCount,
  });
});

// 2. GET /api/cases/:id/evidence - List evidence for case
evidenceRouter.get('/:id/evidence', requireAuth, (req, res) => {
  const { id } = req.params;
  const evidence = query(
    `SELECT ea.*, u.full_name as uploaded_by_name, c.case_code, c.title as case_title
     FROM evidence_assets ea
     LEFT JOIN users u ON ea.uploaded_by = u.id
     LEFT JOIN cases c ON ea.case_id = c.id
     WHERE ea.case_id = ?
     ORDER BY ea.created_at DESC`,
    [id]
  );
  res.json({ success: true, evidence, data: evidence });
});

// 3. POST /api/evidence/upload - Upload file with SHA-256 hash calculation
evidenceRouter.post('/upload', requireAuth, upload.single('file'), (req: AuthRequest, res, next) => {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({ error: 'Vui lòng chọn tệp để tải lên.' });
      return;
    }

    const { case_id, source_type, source_id } = req.body;
    if (!case_id) {
      res.status(400).json({ error: 'case_id là bắt buộc.' });
      return;
    }

    // Calculate SHA-256
    const fileBuffer = fs.readFileSync(file.path);
    const sha256 = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    const assetId = `evd-${crypto.randomUUID().substring(0, 8)}`;
    const relativePath = `/uploads/${file.filename}`;

    run(
      `INSERT INTO evidence_assets (id, case_id, source_type, source_id, file_path, file_name, mime_type, file_size, sha256, uploaded_by, captured_at, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
      [
        assetId,
        case_id,
        source_type || 'CASE',
        source_id || null,
        relativePath,
        file.originalname,
        file.mimetype,
        file.size,
        sha256,
        req.user!.id,
      ]
    );

    // Audit log
    run(
      `INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, metadata_json, ip_address, created_at)
       VALUES (?, ?, 'EVIDENCE_UPLOADED', 'EVIDENCE', ?, ?, ?, datetime('now'))`,
      [
        `aud-${crypto.randomUUID()}`,
        req.user!.id,
        assetId,
        JSON.stringify({ file_name: file.originalname, size: file.size, sha256 }),
        req.ip || '127.0.0.1',
      ]
    );

    const asset = get(`SELECT * FROM evidence_assets WHERE id = ?`, [assetId]);
    res.status(201).json({ success: true, asset, data: asset });
  } catch (err) {
    next(err);
  }
});

// 4. POST /api/evidence/:id/verify-hash - Verify SHA-256 integrity on demand
evidenceRouter.post('/:id/verify-hash', requireAuth, (req, res) => {
  const { id } = req.params;
  const asset = get<any>(`SELECT * FROM evidence_assets WHERE id = ?`, [id]);
  if (!asset) {
    res.status(404).json({ success: false, error: 'Không tìm thấy bằng chứng.' });
    return;
  }

  const fullPath = path.join(PROJECT_ROOT, asset.file_path);
  if (!fs.existsSync(fullPath)) {
    run(`UPDATE evidence_assets SET integrity_status = 'FILE_MISSING' WHERE id = ?`, [id]);
    res.json({
      success: true,
      verified: false,
      integrity_status: 'FILE_MISSING',
      error: 'Tệp không tồn tại trên hệ thống lưu trữ đĩa.',
      stored_sha256: asset.sha256,
    });
    return;
  }

  const content = fs.readFileSync(fullPath);
  const currentHash = crypto.createHash('sha256').update(content).digest('hex');
  const isMatch = currentHash.toLowerCase() === (asset.sha256 || '').toLowerCase();
  const integrityStatus = isMatch ? 'VERIFIED' : 'TAMPERED';

  run(`UPDATE evidence_assets SET integrity_status = ? WHERE id = ?`, [integrityStatus, id]);

  res.json({
    success: true,
    verified: isMatch,
    integrity_status: integrityStatus,
    calculated_sha256: currentHash,
    stored_sha256: asset.sha256,
    verified_at: new Date().toISOString(),
  });
});

