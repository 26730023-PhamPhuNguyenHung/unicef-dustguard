import { query } from '../../../db/connection.js';
import { StatutoryEffectiveChecker } from './statutoryEffectiveChecker.js';

export interface SearchLegalOptions {
  queryText?: string;
  category?: 'DUST' | 'WASH' | 'MESH' | 'TRANSPORT' | 'ALL';
  eventTimestamp?: string;
  limit?: number;
}

export class LegalSearchEngine {
  // Từ điển chuyên ngành mở rộng tiếng Việt (Domain Synonyms)
  private static readonly SYNONYMS: Record<string, string[]> = {
    bụi: ['bụi', '"bụi mịn"', 'pm2.5', 'pm10', '"phát tán bụi"', '"khói bụi"'],
    'che chắn': ['"che chắn"', '"bạt che"', '"lưới chống bụi"', '"rào chắn"'],
    'rửa xe': ['"rửa xe"', '"làm sạch bánh xe"', '"cầu rửa"', '"bùn đất"'],
    'vận chuyển': ['"vận chuyển"', '"xe ben"', '"vật liệu xây dựng"', '"phế thải"'],
    'phun nước': ['"phun nước"', '"phun sương"', '"dập bụi"', '"tưới ẩm"'],
  };

  /**
   * Xây dựng câu truy vấn FTS5 BM25 mở rộng theo từ điển đồng nghĩa
   */
  public static buildExpandedQuery(rawText: string): string {
    const tokens = rawText.toLowerCase().split(/\s+/).filter(t => t.length > 1);
    const expandedTerms = new Set<string>();

    for (const token of tokens) {
      expandedTerms.add(token);
      for (const [key, syns] of Object.entries(this.SYNONYMS)) {
        if (key.includes(token) || token.includes(key)) {
          syns.forEach(s => expandedTerms.add(s));
        }
      }
    }

    if (expandedTerms.size === 0) {
      return 'bụi OR "che chắn" OR "rửa xe"';
    }

    return Array.from(expandedTerms).join(' OR ');
  }

  /**
   * Tìm kiếm điều khoản pháp lý từ FTS5 và kiểm định tính hiệu lực văn bản
   */
  public static searchRelevantSections(options: SearchLegalOptions = {}): any[] {
    const {
      queryText = 'bụi che chắn rửa xe',
      eventTimestamp = new Date().toISOString(),
      limit = 8,
    } = options;

    const ftsQuery = this.buildExpandedQuery(queryText);

    let rawSections: any[] = [];
    try {
      rawSections = query(
        `SELECT s.id, s.section_number, s.heading, s.content,
                d.id as doc_id, d.title as document_title, d.document_number,
                d.effective_date, d.status as doc_status
         FROM legal_sections_fts fts
         JOIN legal_sections s ON fts.id = s.id
         JOIN legal_documents d ON s.document_id = d.id
         WHERE legal_sections_fts MATCH ?
         ORDER BY rank
         LIMIT ?`,
        [ftsQuery, limit * 2]
      );
    } catch {
      // Fallback SQL LIKE nếu FTS5 table rỗng hoặc có lỗi
      rawSections = query(
        `SELECT s.id, s.section_number, s.heading, s.content,
                d.id as doc_id, d.title as document_title, d.document_number,
                d.effective_date, d.status as doc_status
         FROM legal_sections s
         JOIN legal_documents d ON s.document_id = d.id
         WHERE s.content LIKE '%bụi%' OR s.heading LIKE '%bụi%' OR s.heading LIKE '%xây dựng%'
         LIMIT ?`,
        [limit * 2]
      );
    }

    // Lọc theo tính hiệu lực tại thời điểm xem xét (Statutory Effective Verification)
    const verifiedSections: any[] = [];
    for (const sec of rawSections) {
      const docRecord = {
        id: sec.doc_id,
        title: sec.document_title,
        document_number: sec.document_number,
        effective_date: sec.effective_date,
        status: sec.doc_status,
      };

      const check = StatutoryEffectiveChecker.isLawEffectiveAt(docRecord, eventTimestamp);
      if (check.isEffective) {
        verifiedSections.push({
          ...sec,
          effective_verified: true,
          effective_note: check.reason,
        });
      }
      if (verifiedSections.length >= limit) break;
    }

    return verifiedSections;
  }
}
