import { Router, Request, Response } from 'express';
import { query } from '../../db/connection.js';
import { requireAuth } from '../../middleware/auth.js';

export const searchRouter = Router();

// GET /api/search - Cross-Entity Unified Global Search
searchRouter.get('/', requireAuth, (req: Request, res: Response) => {
  const q = (req.query.q as string || '').trim();

  if (!q) {
    res.json({
      success: true,
      query: '',
      results: { cases: [], tasks: [], legal: [], iot: [] },
      total: 0,
    });
    return;
  }

  const pattern = `%${q}%`;

  // 1. Cases
  const cases = query<any>(
    `SELECT id, case_code, title, status, priority, location_text
     FROM cases
     WHERE case_code LIKE ? OR title LIKE ? OR location_text LIKE ?
     LIMIT 6`,
    [pattern, pattern, pattern]
  );

  // 2. Tasks
  const tasks = query<any>(
    `SELECT t.id, t.title, t.status, t.priority, t.task_type, t.case_id, c.case_code
     FROM tasks t
     LEFT JOIN cases c ON t.case_id = c.id
     WHERE t.title LIKE ? OR t.description LIKE ? OR c.case_code LIKE ?
     LIMIT 6`,
    [pattern, pattern, pattern]
  );

  // 3. Legal Sections (FTS5 + LIKE Fallback)
  let legal: any[] = [];
  try {
    // Sanitize FTS5 query
    const ftsQuery = q.replace(/[^a-zA-Z0-9\u00C0-\u1EF9\s]/g, ' ').trim();
    if (ftsQuery) {
      legal = query<any>(
        `SELECT id, document_title, document_number, heading, section_number,
                snippet(legal_sections_fts, 6, '<mark>', '</mark>', '...', 12) as snippet
         FROM legal_sections_fts
         WHERE legal_sections_fts MATCH ?
         LIMIT 6`,
        [ftsQuery]
      );
    }
  } catch {
    // Fallback to standard LIKE
    legal = query<any>(
      `SELECT s.id, d.title as document_title, d.document_number, s.heading, s.section_number, substr(s.content, 1, 100) as snippet
       FROM legal_sections s
       JOIN legal_documents d ON s.document_id = d.id
       WHERE s.heading LIKE ? OR s.content LIKE ? OR d.title LIKE ?
       LIMIT 6`,
      [pattern, pattern, pattern]
    );
  }

  // 4. IoT Devices
  const iot = query<any>(
    `SELECT id, device_code, name, location_text, status
     FROM iot_devices
     WHERE device_code LIKE ? OR name LIKE ? OR location_text LIKE ?
     LIMIT 6`,
    [pattern, pattern, pattern]
  );

  const total = cases.length + tasks.length + legal.length + iot.length;

  res.json({
    success: true,
    query: q,
    results: {
      cases,
      tasks,
      legal,
      iot,
    },
    total,
  });
});
