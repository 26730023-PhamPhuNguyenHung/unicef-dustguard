export interface LegalDocumentRecord {
  id: string;
  title: string;
  document_number: string;
  effective_date: string;
  status: 'ACTIVE' | 'EXPIRED' | 'REPLACED';
}

export class StatutoryEffectiveChecker {
  /**
   * Kiểm tra văn bản quy phạm pháp luật có hiệu lực tại thời điểm xảy ra sự việc hay không
   */
  public static isLawEffectiveAt(doc: LegalDocumentRecord, eventTimestamp: string): {
    isEffective: boolean;
    reason: string;
  } {
    if (doc.status === 'EXPIRED') {
      return {
        isEffective: false,
        reason: `Văn bản ${doc.document_number} đã hết hiệu lực thi hành.`,
      };
    }

    if (doc.status === 'REPLACED') {
      return {
        isEffective: false,
        reason: `Văn bản ${doc.document_number} đã bị thay thế bởi văn bản mới hơn.`,
      };
    }

    const effectiveTime = new Date(doc.effective_date).getTime();
    const eventTime = new Date(eventTimestamp).getTime();

    if (isNaN(effectiveTime) || isNaN(eventTime)) {
      // Trường hợp ngày tháng không chuẩn, giữ nguyên theo trạng thái ACTIVE
      return {
        isEffective: doc.status === 'ACTIVE',
        reason: doc.status === 'ACTIVE' ? 'Văn bản đang có hiệu lực.' : 'Văn bản không hợp lệ.',
      };
    }

    if (eventTime < effectiveTime) {
      return {
        isEffective: false,
        reason: `Tại thời điểm sự việc (${new Date(eventTime).toLocaleDateString('vi-VN')}), văn bản ${doc.document_number} chưa có hiệu lực thi hành (Ngày hiệu lực: ${doc.effective_date}).`,
      };
    }

    return {
      isEffective: true,
      reason: `Văn bản có hiệu lực đầy đủ tại thời điểm xem xét.`,
    };
  }
}
