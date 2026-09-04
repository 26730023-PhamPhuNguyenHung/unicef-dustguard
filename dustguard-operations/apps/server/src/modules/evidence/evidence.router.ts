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

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB max
});

export const evidenceRouter = Router();

// GET /api/cases/:id/evidence - List evidence for case
evidenceRouter.get('/:id/evidence', requireAuth, (req, res) => {
  const { id } = req.params;
  const evidence = query(
    `SELECT ea.*, u.full_name as uploaded_by_name
     FROM evidence_assets ea
     JOIN users u ON ea.uploaded_by = u.id
     WHERE ea.case_id = ?
     ORDER BY ea.created_at DESC`,
    [id]
  );
  res.json({ evidence });
});

// POST /api/evidence/upload - Upload file with SHA-256 hash calculation
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
    res.status(201).json({ asset });
  } catch (err) {
    next(err);
  }
});
