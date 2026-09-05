import { Router, Response } from 'express';
import crypto from 'node:crypto';
import { get, query, run } from '../../db/connection.js';
import { AuthRequest, requireAuth } from '../../middleware/auth.js';
import { requirePermission } from '../../middleware/rbac.js';
import {
  LegalReviewSchema,
  LegalAIOutputSchema,
  LegalAIOutput,
  LegalDocument,
  LegalSection,
} from '../../shared.js';
import { CaseAnalysisService } from '../cases/analysis.service.js';

export const legalRouter = Router();

// GET /api/legal/search?q= - SQLite FTS5 Full Text Search
legalRouter.get('/search', (req: AuthRequest, res) => {
  const q = req.query.q as string | undefined;
  if (!q || !q.trim()) {
    res.json({ results: [], total: 0 });
    return;
  }

  const cleanQuery = q.trim().replace(/['"*]/g, '');
  const ftsQuery = cleanQuery.split(/\s+/).filter(Boolean).map(w => `"${w}"*`).join(' OR ');

  let results: any[] = [];
  try {
    results = query(
      `SELECT
        fts.id as section_id,
        fts.document_id,
        fts.document_title,
        fts.document_number,
        fts.heading,
        fts.section_number,
        fts.content,
        snippet(legal_sections_fts, 6, '<mark>', '</mark>', '...', 20) as snippet_content
       FROM legal_sections_fts fts
       WHERE legal_sections_fts MATCH ?
       ORDER BY rank
       LIMIT 30`,
      [ftsQuery]
    );
  } catch (err) {
    // Fallback to LIKE query if FTS query syntax error
    const term = `%${cleanQuery}%`;
    results = query(
      `SELECT
        s.id as section_id,
        s.document_id,
        d.title as document_title,
        d.document_number,
        s.heading,
        s.section_number,
        s.content,
        substr(s.content, 1, 150) as snippet_content
       FROM legal_sections s
       JOIN legal_documents d ON s.document_id = d.id
       WHERE s.content LIKE ? OR s.heading LIKE ? OR d.title LIKE ?
       LIMIT 30`,
      [term, term, term]
    );
  }

  // Record search history if user is logged in
  if (req.user?.id) {
    run(
      `INSERT INTO legal_search_history (id, user_id, query, results_count, created_at)
       VALUES (?, ?, ?, ?, datetime('now'))`,
      [`sh-${crypto.randomUUID()}`, req.user.id, cleanQuery, results.length]
    );
  }

  res.json({
    query: cleanQuery,
    results,
    total: results.length,
  });
});

// GET /api/legal/documents - List all documents
legalRouter.get('/documents', (req, res) => {
  const documents = query<LegalDocument & { sections_count: number }>(
    `SELECT d.*, count(s.id) as sections_count
     FROM legal_documents d
     LEFT JOIN legal_sections s ON d.id = s.document_id
     GROUP BY d.id
     ORDER BY d.effective_date DESC`
  );

  res.json({ documents });
});

// GET /api/legal/documents/:id - Single document with sections
legalRouter.get('/documents/:id', (req, res) => {
  const { id } = req.params;
  const document = get<LegalDocument>(`SELECT * FROM legal_documents WHERE id = ?`, [id]);
  if (!document) {
    res.status(404).json({ error: 'Không tìm thấy văn bản pháp luật' });
    return;
  }

  const sections = query<LegalSection>(
    `SELECT * FROM legal_sections WHERE document_id = ? ORDER BY section_number ASC`,
    [id]
  );

  res.json({ document, sections });
});

// GET /api/legal/sections/:id - Single section with document details
legalRouter.get('/sections/:id', (req, res) => {
  const { id } = req.params;
  const section = get(
    `SELECT s.*, d.title as document_title, d.document_number, d.authority, d.effective_date
     FROM legal_sections s
     JOIN legal_documents d ON s.document_id = d.id
     WHERE s.id = ?`,
    [id]
  );

  if (!section) {
    res.status(404).json({ error: 'Không tìm thấy điều khoản' });
    return;
  }

  res.json({ section });
});

// POST /api/cases/:id/legal/analyze - Assistive AI Provider & Provenance Rule Engine
legalRouter.post('/:id/legal/analyze', requireAuth, (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const result = CaseAnalysisService.runAnalysis({
      caseId: id,
      userId: req.user!.id,
      userRole: req.user!.role,
      userName: req.user!.full_name,
    });

    const relevantProvisions = (result.output.evidence_matrix || []).flatMap(em =>
      em.legal_provisions.map(lp => ({
        legalSectionId: lp.id,
        reason: `Căn cứ điều khoản: ${lp.number} - ${lp.heading} (${lp.excerpt})`,
      }))
    );

    const potentialIssues = result.output.findings.map(f => ({
      title: f.statement,
      reason: `Căn cứ dữ liệu thực tế từ ${f.source_ids.length} nguồn chứng cứ đối chứng. Độ tin cậy tính toán: ${Math.round(f.confidence * 100)}%.`,
    }));

    const formattedOutput: LegalAIOutput = {
      summary: `Kết quả thẩm tra căn cứ dữ liệu thực tế (SSOT Provenance): Phân loại kết luận "${result.output.conclusion_level}". Ghi nhận ${result.output.findings.length} nhận định có đối chứng nguồn và ${result.output.missing_facts.length} dữ kiện còn thiếu cần xác minh thêm.`,
      potentialIssues: potentialIssues.length > 0 ? potentialIssues : [
        {
          title: 'Chưa đủ dữ liệu hiện trường để xác lập căn cứ vi phạm',
          reason: 'Hồ sơ đang thiếu biên bản kiểm tra thực địa và kết quả đo đạc chuẩn.',
        },
      ],
      relevantProvisions,
      missingInformation: result.output.missing_facts.map(m => m.fact),
      suggestedChecklistItems: result.output.missing_facts.map(m => m.recommended_verification_action),
      confidence: result.output.findings[0]?.confidence ?? 0.3,
      disclaimer: result.output.disclaimer,
      conclusion_level: result.output.conclusion_level,
      findings: result.output.findings,
      missing_facts: result.output.missing_facts,
      recommended_actions: result.output.recommended_actions,
    };

    // Save backward compatibility to legal_analyses table
    const analysisId = result.analysisRunId;
    run(
      `INSERT INTO legal_analyses (id, case_id, analysis_type, provider, model, prompt_version, input_snapshot, output_json, created_by, created_at)
       VALUES (?, ?, 'CASE_LEGAL_INTELLIGENCE', 'DUSTGUARD_PROVENANCE_ENGINE', 'provenance-v2.0', '2.0', ?, ?, ?, datetime('now'))`,
      [analysisId, id, JSON.stringify({ caseId: id }), JSON.stringify(formattedOutput), req.user!.id]
    );

    res.json({
      analysis: {
        id: analysisId,
        output: formattedOutput,
        evidence_matrix: result.output.evidence_matrix,
        provider: result.provider,
        created_at: result.created_at,
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/cases/:id/legal/analyses - History of analyses
legalRouter.get('/:id/legal/analyses', requireAuth, (req, res) => {
  const { id } = req.params;
  const analyses = query(
    `SELECT la.*, u.full_name as created_by_name
     FROM legal_analyses la
     JOIN users u ON la.created_by = u.id
     WHERE la.case_id = ?
     ORDER BY la.created_at DESC`,
    [id]
  );

  const formatted = analyses.map(a => ({
    ...a,
    output: JSON.parse(a.output_json),
  }));

  res.json({ analyses: formatted });
});

// POST /api/cases/:id/legal/review - Human Legal Review
legalRouter.post('/:id/legal/review', requirePermission('legal:review'), (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const { status, summary, legal_basis_note } = LegalReviewSchema.parse(req.body);

    const targetCase = get<any>(`SELECT * FROM cases WHERE id = ?`, [id]);
    if (!targetCase) {
      res.status(404).json({ error: 'Không tìm thấy hồ sơ' });
      return;
    }

    const existingReview = get(`SELECT id FROM legal_reviews WHERE case_id = ?`, [id]);
    const reviewId = existingReview ? existingReview.id : `lrev-${crypto.randomUUID()}`;

    if (existingReview) {
      run(
        `UPDATE legal_reviews
         SET status = ?, summary = ?, legal_basis_note = ?, reviewed_at = datetime('now')
         WHERE id = ?`,
        [status, summary, legal_basis_note || null, reviewId]
      );
    } else {
      run(
        `INSERT INTO legal_reviews (id, case_id, reviewer_id, status, summary, legal_basis_note, created_at, reviewed_at)
         VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
        [reviewId, id, req.user!.id, status, summary, legal_basis_note || null]
      );
    }

    // Timeline event
    run(
      `INSERT INTO case_timeline (id, case_id, event_type, actor_id, actor_name, actor_role, stage, description, metadata_json, created_at)
       VALUES (?, ?, 'LEGAL_REVIEW_COMPLETED', ?, ?, ?, 'LEGAL', ?, ?, datetime('now'))`,
      [
        `tml-${crypto.randomUUID()}`,
        id,
        req.user!.id,
        req.user!.full_name,
        req.user!.role,
        `Chuyên viên pháp chế hoàn thành thẩm tra hồ sơ với trạng thái: "${status}". Kết luận: ${summary}`,
        JSON.stringify({ status, reviewId }),
      ]
    );

    // Audit log
    run(
      `INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, metadata_json, ip_address, created_at)
       VALUES (?, ?, 'LEGAL_REVIEW_SUBMITTED', 'LEGAL_REVIEW', ?, ?, ?, datetime('now'))`,
      [`aud-${crypto.randomUUID()}`, req.user!.id, reviewId, JSON.stringify({ status, summary }), req.ip || '127.0.0.1']
    );

    const updated = get(`SELECT lr.*, u.full_name as reviewer_name FROM legal_reviews lr JOIN users u ON lr.reviewer_id = u.id WHERE lr.id = ?`, [reviewId]);
    res.json({ success: true, review: updated });
  } catch (err) {
    next(err);
  }
});

// Vietnamese Legal Structure Parser Helper
function parseVietnameseLegalText(text: string) {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const sections: any[] = [];
  let currentChapter: any = null;
  let currentArticle: any = null;
  let currentClause: any = null;

  let docTitle = 'Văn bản pháp luật môi trường';
  let docNumber = '01/2026/QĐ-TTg';
  let authority = 'Cơ quan có thẩm quyền';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect metadata
    if (line.match(/^Số:\s*(.+)$/i)) {
      docNumber = line.replace(/^Số:\s*/i, '').trim();
      continue;
    }
    if (line.match(/^(ỦY BAN NHÂN DÂN|CHÍNH PHỦ|BỘ TÀI NGUYÊN VÀ MÔI TRƯỜNG)/i)) {
      authority = line;
      continue;
    }
    if (line.match(/^(LUẬT|NGHỊ ĐỊNH|QUYẾT ĐỊNH|THÔNG TƯ)\s+(.+)$/i)) {
      docTitle = line;
      continue;
    }

    // Detect Chương (Chapter)
    const chapterMatch = line.match(/^(?:CHƯƠNG|Chương)\s+([IVXLCDM\d]+)[\s:.\-]*(.*)$/i);
    if (chapterMatch) {
      const heading = chapterMatch[2] || (lines[i + 1] && !lines[i + 1].startsWith('Điều') ? lines[++i] : '');
      currentChapter = {
        id: `sec-parsed-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        section_type: 'Chapter',
        section_number: `Chương ${chapterMatch[1]}`,
        heading: heading || `Chương ${chapterMatch[1]}`,
        content: line,
        children: [],
      };
      sections.push(currentChapter);
      currentArticle = null;
      currentClause = null;
      continue;
    }

    // Detect Điều (Article)
    const articleMatch = line.match(/^(?:ĐIỀU|Điều)\s+(\d+)[\s:.\-]*(.*)$/i);
    if (articleMatch) {
      const heading = articleMatch[2] || (lines[i + 1] && !lines[i + 1].match(/^\d+\./) ? lines[++i] : '');
      currentArticle = {
        id: `sec-parsed-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        section_type: 'Article',
        section_number: `Điều ${articleMatch[1]}`,
        heading: heading || `Điều ${articleMatch[1]}`,
        content: line,
        children: [],
      };
      if (currentChapter) {
        currentChapter.children.push(currentArticle);
      } else {
        sections.push(currentArticle);
      }
      currentClause = null;
      continue;
    }

    // Detect Khoản (Clause)
    const clauseMatch = line.match(/^(\d+)\.\s+(.*)$/);
    if (clauseMatch && currentArticle) {
      currentClause = {
        id: `sec-parsed-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        section_type: 'Clause',
        section_number: `Khoản ${clauseMatch[1]}`,
        heading: `Khoản ${clauseMatch[1]} Điều ${currentArticle.section_number.replace('Điều ', '')}`,
        content: clauseMatch[2],
        children: [],
      };
      currentArticle.children.push(currentClause);
      continue;
    }

    // Detect Điểm (Point)
    const pointMatch = line.match(/^([a-zđ])\)\s+(.*)$/i);
    if (pointMatch && (currentClause || currentArticle)) {
      const point = {
        id: `sec-parsed-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        section_type: 'Point',
        section_number: `Điểm ${pointMatch[1].toLowerCase()}`,
        heading: `Điểm ${pointMatch[1].toLowerCase()}`,
        content: pointMatch[2],
      };
      if (currentClause) {
        currentClause.children.push(point);
      } else {
        currentArticle.children.push(point);
      }
      continue;
    }

    // Content continuation
    if (currentClause) {
      currentClause.content += ' ' + line;
    } else if (currentArticle) {
      currentArticle.content += ' ' + line;
    }
  }

  return { docTitle, docNumber, authority, sections };
}

// POST /api/legal/import - Parse raw text / document for Human Review
legalRouter.post('/import', requireAuth, (req: AuthRequest, res) => {
  const text = req.body.text || req.body.text_content;
  const file_name = req.body.file_name || 'document.txt';
  const customTitle = req.body.title;
  const customDocNumber = req.body.document_number;
  const customAuthority = req.body.authority;

  if (!text || typeof text !== 'string' || !text.trim()) {
    res.status(400).json({ error: 'Nội dung văn bản (text) là bắt buộc' });
    return;
  }

  const sha256 = crypto.createHash('sha256').update(text, 'utf-8').digest('hex');
  const parsed = parseVietnameseLegalText(text);

  const flatSections: any[] = [];
  function flatten(secs: any[]) {
    for (const s of secs) {
      flatSections.push({
        id: s.id,
        section_type: s.section_type,
        section_number: s.section_number,
        heading: s.heading,
        content: s.content,
      });
      if (Array.isArray(s.children) && s.children.length > 0) {
        flatten(s.children);
      }
    }
  }
  flatten(parsed.sections);

  const finalTitle = customTitle || parsed.docTitle;
  const finalDocNumber = customDocNumber || parsed.docNumber;
  const finalAuthority = customAuthority || parsed.authority;

  const doc = {
    title: finalTitle,
    document_number: finalDocNumber,
    authority: finalAuthority,
    sha256,
    file_name,
  };

  res.json({
    success: true,
    document: doc,
    sections: flatSections.length > 0 ? flatSections : parsed.sections,
    data: {
      file_name,
      sha256,
      title: finalTitle,
      document_number: finalDocNumber,
      authority: finalAuthority,
      sections: parsed.sections,
      total_sections: parsed.sections.length,
    },
  });
});

// POST /api/legal/documents - Human Approved Import (Persist into DB + FTS5)
legalRouter.post('/documents', requireAuth, (req: AuthRequest, res) => {
  const { title, document_number, authority, issued_date, effective_date, sections = [] } = req.body;

  if (!title || !document_number) {
    res.status(400).json({ error: 'Tiêu đề và số hiệu văn bản là bắt buộc' });
    return;
  }

  const docId = `doc-${Date.now()}`;
  const now = new Date().toISOString();

  run(
    `INSERT INTO legal_documents (id, title, document_number, authority, issued_date, effective_date, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, 'ACTIVE', ?)`,
    [docId, title, document_number, authority || 'Cơ quan có thẩm quyền', issued_date || now, effective_date || now, now]
  );

  function normalizeSectionType(type: string): string {
    const upper = (type || '').toUpperCase();
    if (upper.includes('CHƯƠNG') || upper === 'CHAPTER') return 'Chapter';
    if (upper.includes('MỤC') || upper === 'SECTION') return 'Section';
    if (upper.includes('ĐIỀU') || upper === 'ARTICLE') return 'Article';
    if (upper.includes('KHOẢN') || upper === 'CLAUSE') return 'Clause';
    if (upper.includes('ĐIỂM') || upper === 'POINT') return 'Point';
    return 'Article';
  }

  // Flatten and persist sections into legal_sections and legal_sections_fts
  function insertSection(s: any, parentId: string | null = null) {
    const secId = s.id || `sec-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const normalizedType = normalizeSectionType(s.section_type);
    run(
      `INSERT INTO legal_sections (id, document_id, section_type, section_number, heading, content, parent_section_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [secId, docId, normalizedType, s.section_number || '', s.heading || '', s.content || '', parentId]
    );

    run(
      `INSERT INTO legal_sections_fts (id, document_id, document_title, document_number, heading, section_number, content)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [secId, docId, title, document_number, s.heading || '', s.section_number || '', s.content || '']
    );

    if (Array.isArray(s.children)) {
      for (const child of s.children) {
        insertSection(child, secId);
      }
    }
  }

  for (const s of sections) {
    insertSection(s, null);
  }

  // Audit log
  run(
    `INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, metadata_json, ip_address, created_at)
     VALUES (?, ?, 'IMPORT_LEGAL_DOCUMENT', 'LEGAL_DOCUMENT', ?, ?, ?, datetime('now'))`,
    [`aud-${Date.now()}`, req.user?.id || null, docId, JSON.stringify({ title, document_number }), req.ip || '127.0.0.1']
  );

  const created = get(`SELECT * FROM legal_documents WHERE id = ?`, [docId]);
  res.status(201).json({ success: true, document: created, data: created });
});

// GET /api/cases/:id/legal/evidence-gaps - Missing Evidence Gap Engine
legalRouter.get('/:id/legal/evidence-gaps', requireAuth, (req, res) => {
  const { id } = req.params;
  const targetCase = get<any>(`SELECT * FROM cases WHERE id = ?`, [id]);
  if (!targetCase) {
    res.status(404).json({ error: 'Không tìm thấy hồ sơ' });
    return;
  }

  const existingAssets = query<any>(`SELECT * FROM evidence_assets WHERE case_id = ?`, [id]);
  const hasWashEvidence = existingAssets.some(a => a.file_name.toLowerCase().includes('wash') || a.file_name.toLowerCase().includes('xe'));
  const hasMeshEvidence = existingAssets.some(a => a.file_name.toLowerCase().includes('mesh') || a.file_name.toLowerCase().includes('che') || a.file_name.toLowerCase().includes('luoi'));
  const hasDustReading = existingAssets.some(a => a.source_type === 'INSPECTION');

  const gaps: any[] = [];

  if (!hasMeshEvidence) {
    gaps.push({
      type: 'PHOTO',
      description: 'Ảnh chụp toàn cảnh biện pháp che chắn, lưới chắn bụi xung quanh công trình',
      reason: 'Căn cứ xác định hành vi quy định tại Điểm a Khoản 1 Điều 15 Nghị định 45/2022/NĐ-CP',
      legalSectionIds: ['sec-nd45-15-1a'],
      suggestedCollectionMethod: 'Chụp ảnh góc rộng từ ngoài hàng rào công trình',
    });
  }

  if (!hasWashEvidence) {
    gaps.push({
      type: 'DOCUMENT',
      description: 'Nhật ký vận hành trạm rửa xe tự động và ảnh chụp bánh xe trước khi rời công trường',
      reason: 'Căn cứ đối chiếu Điểm b Khoản 1 Điều 15 Nghị định 45/2022/NĐ-CP',
      legalSectionIds: ['sec-nd45-15-1b'],
      suggestedCollectionMethod: 'Yêu cầu nhà thầu xuất trình sổ giao ca và trích xuất camera cổng',
    });
  }

  if (!hasDustReading) {
    gaps.push({
      type: 'LOG',
      description: 'Biên bản đo nồng độ bụi phát tán xung quanh đối chiếu QCVN 05:2023/BTNMT',
      reason: 'Căn cứ áp dụng mức xử phạt theo Điều 20 Nghị định 45/2022/NĐ-CP',
      legalSectionIds: ['sec-nd45-20', 'sec-qcvn-dust-limits'],
      suggestedCollectionMethod: 'Sử dụng thiết bị đo bụi chuyên dụng hoặc trích xuất số liệu trạm quan trắc IoT phụ cận',
    });
  }

  res.json({
    success: true,
    data: {
      case_id: id,
      total_gaps: gaps.length,
      gaps,
    },
  });
});

// GET /api/cases/:id/decision-pack - Generate Decision Pack
legalRouter.get('/:id/decision-pack', requireAuth, (req, res) => {
  const { id } = req.params;
  const targetCase = get<any>(`SELECT c.*, u.full_name as assigned_staff_name FROM cases c LEFT JOIN users u ON c.assigned_staff_id = u.id WHERE c.id = ?`, [id]);
  if (!targetCase) {
    res.status(404).json({ error: 'Không tìm thấy hồ sơ' });
    return;
  }

  const signals = query<any>(`SELECT s.* FROM signals s JOIN case_signals cs ON s.id = cs.signal_id WHERE cs.case_id = ?`, [id]);
  const evidence = query<any>(`SELECT * FROM evidence_assets WHERE case_id = ?`, [id]);
  const reviews = query<any>(`SELECT lr.*, u.full_name as reviewer_name FROM legal_reviews lr JOIN users u ON lr.reviewer_id = u.id WHERE lr.case_id = ?`, [id]);
  const inspections = query<any>(`SELECT * FROM inspections WHERE case_id = ?`, [id]);
  const findings = query<any>(`SELECT f.*, ls.section_number, ls.heading as legal_heading FROM inspection_findings f LEFT JOIN legal_sections ls ON f.legal_section_id = ls.id WHERE f.case_id = ?`, [id]);
  const actions = query<any>(`SELECT * FROM corrective_actions WHERE case_id = ?`, [id]);
  const timeline = query<any>(`SELECT * FROM case_timeline WHERE case_id = ? ORDER BY created_at ASC`, [id]);
  const closure = get<any>(`SELECT cc.*, u.full_name as closed_by_name FROM case_closures cc JOIN users u ON cc.closed_by = u.id WHERE cc.case_id = ?`, [id]);

  const html = `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="utf-8">
      <title>Hồ sơ Quyết định Vụ việc ${targetCase.case_code}</title>
      <style>
        body { font-family: 'Times New Roman', serif; line-height: 1.5; color: #101828; padding: 40px; max-width: 900px; margin: auto; }
        h1, h2, h3 { text-align: center; margin-bottom: 8px; }
        .header-box { display: flex; justify-content: space-between; border-bottom: 2px solid #000; padding-bottom: 12px; margin-bottom: 24px; }
        .section { margin-top: 24px; }
        table { width: 100%; border-collapse: collapse; margin-top: 8px; }
        th, td { border: 1px solid #ccc; padding: 8px; text-align: left; font-size: 14px; }
        th { background: #f4f5f7; }
        .footer-sign { display: flex; justify-content: space-between; margin-top: 48px; text-align: center; }
      </style>
    </head>
    <body>
      <div class="header-box">
        <div>
          <strong>ỦY BAN NHÂN DÂN TP. HỒ CHÍ MINH</strong><br>
          <strong>SỞ TÀI NGUYÊN VÀ MÔI TRƯỜNG</strong>
        </div>
        <div style="text-align: right;">
          <strong>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong><br>
          <em>Độc lập - Tự do - Hạnh phúc</em><br>
          <small>Thời gian xuất: ${new Date().toLocaleString('vi-VN')}</small>
        </div>
      </div>

      <h1>HỒ SƠ TỔNG HỢP VỤ VIỆC MÔI TRƯỜNG</h1>
      <h3>Mã hồ sơ: ${targetCase.case_code}</h3>

      <div class="section">
        <h3>I. THÔNG TIN CHUNG</h3>
        <p><strong>Tiêu đề:</strong> ${targetCase.title}</p>
        <p><strong>Địa điểm:</strong> ${targetCase.location_text} (${targetCase.district})</p>
        <p><strong>Nhà thầu/Đơn vị:</strong> ${targetCase.contractor_name || 'Đang cập nhật'}</p>
        <p><strong>Trạng thái vận hành:</strong> ${targetCase.status}</p>
        <p><strong>Cán bộ thụ lý:</strong> ${targetCase.assigned_staff_name || 'Chưa phân công'}</p>
      </div>

      <div class="section">
        <h3>II. BẰNG CHỨNG SỐ & MÃ BĂM TOÀN VẸN (SHA-256)</h3>
        <table>
          <thead>
            <tr><th>STT</th><th>Tên tệp</th><th>Nguồn</th><th>Mã băm SHA-256</th><th>Dung lượng</th></tr>
          </thead>
          <tbody>
            ${evidence.map((e: any, idx: number) => `
              <tr>
                <td>${idx + 1}</td>
                <td>${e.file_name}</td>
                <td>${e.source_type}</td>
                <td><code>${e.sha256}</code></td>
                <td>${Math.round(e.file_size / 1024)} KB</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="section">
        <h3>III. Ý KIẾN THẨM TRA PHÁP CHẾ</h3>
        ${reviews.length === 0 ? '<p><em>Chưa có biên bản pháp chế chính thức.</em></p>' : reviews.map((r: any) => `
          <div style="background: #f9fafb; padding: 12px; border-left: 4px solid #0d6f64; margin-bottom: 8px;">
            <p><strong>Chuyên viên:</strong> ${r.reviewer_name} | <strong>Trạng thái:</strong> ${r.status}</p>
            <p><strong>Nội dung:</strong> ${r.summary}</p>
            <p><strong>Căn cứ:</strong> ${r.legal_basis_note || 'Nghị định 45/2022/NĐ-CP'}</p>
          </div>
        `).join('')}
      </div>

      <div class="section">
        <h3>IV. KẾT QUẢ KIỂM TRA HIỆN TRƯỜNG & PHÁT HIỆN</h3>
        <table>
          <thead>
            <tr><th>Phát hiện vi phạm</th><th>Mức độ</th><th>Căn cứ quy chuẩn</th><th>Ghi chú</th></tr>
          </thead>
          <tbody>
            ${findings.map((f: any) => `
              <tr>
                <td>${f.finding}</td>
                <td><strong>${f.severity}</strong></td>
                <td>${f.section_number || 'Nghị định 45/2022'}</td>
                <td>${f.staff_note || '—'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="section">
        <h3>V. BIỆN PHÁP KHẮC PHỤC & KẾT LUẬN</h3>
        <p><strong>Tổng số biện pháp đã ban hành:</strong> ${actions.length} (Đã xác minh: ${actions.filter((a: any) => a.status === 'VERIFIED' || a.status === 'CLOSED').length})</p>
        ${closure ? `
          <div style="border: 1px solid #12b76a; padding: 12px; background: #ecfdf3;">
            <h4 style="margin: 0; color: #027a48;">KẾT LUẬN ĐÓNG HỒ SƠ CHÍNH THỨC</h4>
            <p><strong>Người duyệt:</strong> ${closure.closed_by_name} (${closure.closed_at})</p>
            <p><strong>Lý do đóng:</strong> ${closure.closure_reason}</p>
            <p><strong>Tóm tắt:</strong> ${closure.closure_summary}</p>
          </div>
        ` : '<p><em>Hồ sơ đang trong quá trình xử lý, chưa kết thúc.</em></p>'}
      </div>

      <div class="footer-sign">
        <div>
          <strong>CÁN BỘ THỤ LÝ</strong><br><br><br>
          ${targetCase.assigned_staff_name || '................................'}
        </div>
        <div>
          <strong>LÃNH ĐẠO PHÊ DUYỆT</strong><br><br><br>
          ${closure?.closed_by_name || '................................'}
        </div>
      </div>
    </body>
    </html>
  `;

  // Return HTML first for direct browser viewing (Section 58: HTML first)
  if (req.query.format === 'json' || (req.headers.accept?.includes('application/json') && !req.headers.accept?.includes('text/html'))) {
    res.json({
      success: true,
      data: {
        case_id: id,
        case_code: targetCase.case_code,
        generated_at: new Date().toISOString(),
        raw_data: {
          targetCase,
          signals,
          evidence,
          reviews,
          inspections,
          findings,
          actions,
          timeline,
          closure,
        },
        html,
      },
    });
    return;
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8').send(html);
});
