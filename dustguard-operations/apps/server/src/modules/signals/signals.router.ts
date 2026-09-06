import { Router, Request, Response } from 'express';
import crypto from 'node:crypto';
import { query, queryOne, run, transaction } from '../../db/connection.js';
import { requireAuth, AuthRequest } from '../../middleware/auth.js';
import { requireCapability } from '../../middleware/rbac.js';
import { SignalCreateSchema, PublicReportSchema, SignalLinkCaseSchema, SignalCreateCaseSchema } from '../../shared.js';

export const signalsRouter = Router();

// Haversine distance in meters
function haversineDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // metres
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

// 1. List Signals
signalsRouter.get('/', requireAuth, (req: Request, res: Response) => {
  const { source_type, search, has_case } = req.query;

  let sql = `
    SELECT s.*, 
      GROUP_CONCAT(cs.case_id) as linked_case_ids,
      COUNT(cs.case_id) as linked_case_count
    FROM signals s
    LEFT JOIN case_signals cs ON s.id = cs.signal_id
    WHERE 1=1
  `;
  const params: any[] = [];

  if (source_type) {
    sql += ` AND s.source_type = ?`;
    params.push(source_type);
  }
  if (search) {
    sql += ` AND (s.title LIKE ? OR s.location_text LIKE ? OR s.description LIKE ?)`;
    const term = `%${search}%`;
    params.push(term, term, term);
  }

  sql += ` GROUP BY s.id ORDER BY s.observed_at DESC`;

  const rows = query<any>(sql, params);
  const data = rows.filter(r => {
    if (has_case === 'true') return r.linked_case_count > 0;
    if (has_case === 'false') return r.linked_case_count === 0;
    return true;
  });

  res.json({ success: true, data });
});

// 2. Create Signal
signalsRouter.post('/', requireAuth, (req: Request, res: Response, next) => {
  try {
    const {
      source_type,
      external_source_id,
      signal_type,
      title,
      description,
      location_text,
      latitude,
      longitude,
      observed_at,
      payload_json,
    } = SignalCreateSchema.parse(req.body);

    const id = `sig-${Date.now()}-${crypto.randomUUID().substring(0, 6)}`;
    const observedAtStr = observed_at || new Date().toISOString();

    run(
      `INSERT INTO signals (id, source_type, external_source_id, signal_type, title, description, location_text, latitude, longitude, observed_at, received_at, payload_json, integrity_status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), ?, 'VALID', datetime('now'))`,
      [id, source_type, external_source_id || null, signal_type, title, description, location_text, latitude, longitude, observedAtStr, payload_json || null]
    );

    const created = queryOne<any>(`SELECT * FROM signals WHERE id = ?`, [id]);
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    next(err);
  }
});

// 3. Get Signal Detail
signalsRouter.get('/:id', requireAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const signal = queryOne<any>(`SELECT * FROM signals WHERE id = ?`, [id]);
  if (!signal) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Không tìm thấy tín hiệu' } });
    return;
  }

  const linkedCases = query<any>(
    `SELECT c.*, cs.linked_at, cs.notes as link_notes, u.full_name as linked_by_name
     FROM case_signals cs
     JOIN cases c ON cs.case_id = c.id
     LEFT JOIN users u ON cs.linked_by = u.id
     WHERE cs.signal_id = ?`,
    [id]
  );

  res.json({
    success: true,
    data: {
      ...signal,
      linkedCases,
    },
  });
});

// 4. Deterministic Correlation Engine (Matches for a Signal)
signalsRouter.get('/:id/matches', requireAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const signal = queryOne<any>(`SELECT * FROM signals WHERE id = ?`, [id]);
  if (!signal) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Không tìm thấy tín hiệu' } });
    return;
  }

  // Find all active cases (not closed)
  const activeCases = query<any>(
    `SELECT * FROM cases WHERE status != 'CLOSED' ORDER BY updated_at DESC LIMIT 50`
  );

  const matches: any[] = [];
  const signalTime = new Date(signal.observed_at).getTime();

  for (const c of activeCases) {
    const distanceMeters = haversineDistanceMeters(signal.latitude, signal.longitude, c.latitude, c.longitude);
    const caseTime = new Date(c.created_at).getTime();
    const timeDiffMinutes = Math.round(Math.abs(signalTime - caseTime) / 60000);

    const reasons: string[] = [];

    if (distanceMeters <= 500) {
      reasons.push(`Khoảng cách địa lý rất gần (${distanceMeters}m)`);
    } else if (distanceMeters <= 1500) {
      reasons.push(`Nằm trong bán kính lân cận (${distanceMeters}m)`);
    }

    if (timeDiffMinutes <= 120) {
      reasons.push(`Thời điểm phát sinh cách nhau ${timeDiffMinutes} phút`);
    } else if (timeDiffMinutes <= 1440) {
      reasons.push(`Cùng xảy ra trong vòng 24 giờ (${Math.round(timeDiffMinutes / 60)} giờ)`);
    }

    if (signal.location_text && c.location_text) {
      const sigLocWords = signal.location_text.toLowerCase().split(/[\s,]+/);
      const caseLocWords = c.location_text.toLowerCase().split(/[\s,]+/);
      const commonWords = sigLocWords.filter((w: string) => w.length > 3 && caseLocWords.includes(w));
      if (commonWords.length > 0) {
        reasons.push(`Trùng khớp từ khóa địa chỉ: ${commonWords.slice(0, 2).join(', ')}`);
      }
    }

    if (signal.location_text && c.district && signal.location_text.includes(c.district)) {
      reasons.push(`Cùng địa bàn quận/huyện (${c.district})`);
    }

    // Only suggest if at least distance <= 2000m or 2 reasons matched
    if ((distanceMeters <= 2000 && reasons.length >= 1) || reasons.length >= 2) {
      matches.push({
        case_id: c.id,
        case_code: c.case_code,
        title: c.title,
        status: c.status,
        district: c.district,
        address: c.location_text,
        distanceMeters,
        timeDiffMinutes,
        reasons,
      });
    }
  }

  // Sort by distance ascending
  matches.sort((a, b) => a.distanceMeters - b.distanceMeters);

  res.json({
    success: true,
    data: {
      signal_id: id,
      matches,
    },
  });
});

// 5. Link Signal to Case
signalsRouter.post('/:id/link-case', requireAuth, requireCapability('case:update'), (req: AuthRequest, res: Response, next) => {
 try {
  const { id } = req.params;
  const { case_id, notes } = SignalLinkCaseSchema.parse(req.body);

  const signal = queryOne<any>(`SELECT * FROM signals WHERE id = ?`, [id]);
  const caseRecord = queryOne<any>(`SELECT * FROM cases WHERE id = ?`, [case_id]);

  if (!signal || !caseRecord) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Tín hiệu hoặc vụ việc không tồn tại' } });
    return;
  }

  transaction(() => {
    run(
      `INSERT OR REPLACE INTO case_signals (id, case_id, signal_id, linked_at, linked_by, notes)
       VALUES (?, ?, ?, datetime('now'), ?, ?)`,
      [`cs-${Date.now()}`, case_id, id, req.user?.id || null, notes]
    );

    run(
      `INSERT INTO case_timeline (id, case_id, event_type, actor_id, actor_name, actor_role, stage, description, metadata_json, created_at)
       VALUES (?, ?, 'SIGNAL_LINKED', ?, ?, ?, 'INTAKE', ?, ?, datetime('now'))`,
      [
        `tm-${Date.now()}`,
        case_id,
        req.user?.id || null,
        req.user?.full_name || 'Hệ thống',
        req.user?.role || 'staff',
        `Liên kết tín hiệu [${signal.source_type}] "${signal.title}" vào vụ việc`,
        JSON.stringify({ signal_id: id, source: signal.source_type }),
      ]
    );

    run(
      `INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, metadata_json, ip_address, created_at)
       VALUES (?, ?, 'LINK_SIGNAL', 'CASE', ?, ?, ?, datetime('now'))`,
      [
        `aud-${Date.now()}`,
        req.user?.id || null,
        case_id,
        JSON.stringify({ signal_id: id, notes }),
        req.ip || '127.0.0.1',
      ]
    );
  });

  res.json({
    success: true,
    data: {
      linked: true,
      case_id,
      signal_id: id,
    },
  });
 } catch (err) {
   next(err);
 }
});

// 6. Public Community Report Submission (No auth required)
signalsRouter.post('/public-report', (req: Request, res: Response, next) => {
 try {
  const {
    title,
    description,
    location_text,
    latitude,
    longitude,
    project_id,
    reporter_name,
    reporter_phone,
    photos,
  } = PublicReportSchema.parse(req.body);

  const signalId = `sig-pub-${Date.now()}-${crypto.randomUUID().substring(0, 6)}`;
  const payload = {
    reporter_name,
    reporter_phone,
    project_id,
    photos,
  };

  run(
    `INSERT INTO signals (id, source_type, external_source_id, signal_type, title, description, location_text, latitude, longitude, observed_at, received_at, payload_json, integrity_status, created_at)
     VALUES (?, 'COMMUNITY', ?, 'DUST_PLUME', ?, ?, ?, ?, ?, datetime('now'), datetime('now'), ?, 'VALID', datetime('now'))`,
    [
      signalId,
      `PUB-REP-${Date.now()}`,
      title,
      description,
      location_text,
      latitude,
      longitude,
      JSON.stringify(payload),
    ]
  );

  const created = queryOne<any>(`SELECT * FROM signals WHERE id = ?`, [signalId]);
  res.status(201).json({
    success: true,
    message: 'Gửi phản ánh môi trường thành công! Cán bộ địa bàn sẽ tiếp nhận và xử lý.',
    data: created,
    signal: created,
  });
 } catch (err) {
   next(err);
 }
});

// 7. Triage Signal into an Official Case
signalsRouter.post('/:id/create-case', requireAuth, (req: AuthRequest, res: Response, next) => {
 try {
  const { id } = req.params;
  const signal = queryOne<any>(`SELECT * FROM signals WHERE id = ?`, [id]);

  if (!signal) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Không tìm thấy phản ánh / tín hiệu' } });
    return;
  }

  // Check if signal is already linked to an active case
  const existingLink = queryOne<any>(`SELECT case_id FROM case_signals WHERE signal_id = ?`, [id]);
  if (existingLink) {
    const existingCase = queryOne<any>(`SELECT * FROM cases WHERE id = ?`, [existingLink.case_id]);
    if (existingCase) {
      res.json({
        success: true,
        message: 'Tín hiệu đã được liên kết với hồ sơ vụ việc trước đó.',
        case: existingCase,
      });
      return;
    }
  }

  const { priority, assigned_staff_id, project_id, contractor_id, contractor_name } = SignalCreateCaseSchema.parse(req.body ?? {});

  const countRow = queryOne<{ c: number }>(`SELECT count(*) as c FROM cases`);
  const nextNum = (countRow?.c || 0) + 1;
  const case_code = `DG-2026-OP-${String(nextNum).padStart(3, '0')}`;
  const caseId = `case-${Date.now()}-${crypto.randomUUID().substring(0, 6)}`;

  let district = 'TP.HCM';
  if (signal.location_text.includes('Quận') || signal.location_text.includes('Huyện') || signal.location_text.includes('Thủ Đức')) {
    const parts = signal.location_text.split(',');
    for (const p of parts) {
      if (p.includes('Quận') || p.includes('Huyện') || p.includes('Thủ Đức')) {
        district = p.trim();
        break;
      }
    }
  }

  transaction(() => {
    run(
      `INSERT INTO cases (id, case_code, title, description, location_text, district, latitude, longitude, source, source_reference, source_report_count, status, assigned_staff_id, project_id, contractor_id, contractor_name, priority, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 'NEW', ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
      [
        caseId,
        case_code,
        signal.title,
        signal.description || 'Tiếp nhận xử lý từ phản ánh của người dân',
        signal.location_text,
        district,
        signal.latitude,
        signal.longitude,
        signal.source_type,
        signal.id,
        assigned_staff_id || null,
        project_id || null,
        contractor_id || null,
        contractor_name || null,
        priority,
      ]
    );

    // Link case and signal
    run(
      `INSERT INTO case_signals (id, case_id, signal_id, linked_at, linked_by, notes)
       VALUES (?, ?, ?, datetime('now'), ?, 'Khởi tạo hồ sơ vụ việc từ tín hiệu phản ánh')`,
      [`cs-${Date.now()}`, caseId, signal.id, req.user?.id || null]
    );

    // Timeline event
    run(
      `INSERT INTO case_timeline (id, case_id, event_type, actor_id, actor_name, actor_role, stage, description, metadata_json, created_at)
       VALUES (?, ?, 'CASE_CREATED_FROM_SIGNAL', ?, ?, ?, 'INTAKE', ?, ?, datetime('now'))`,
      [
        `tm-${Date.now()}`,
        caseId,
        req.user?.id || null,
        req.user?.full_name || 'Cán bộ tiếp nhận',
        req.user?.role || 'staff',
        `Tiếp nhận phản ánh [${signal.source_type}] "${signal.title}" và khởi tạo vụ việc ${case_code}`,
        JSON.stringify({ signal_id: signal.id, case_code }),
      ]
    );
  });

  const createdCase = queryOne<any>(`SELECT * FROM cases WHERE id = ?`, [caseId]);
  res.status(201).json({
    success: true,
    message: `Tiếp nhận phản ánh thành công! Đã tạo vụ việc ${case_code}.`,
    case: createdCase,
  });
 } catch (err) {
   next(err);
 }
});

