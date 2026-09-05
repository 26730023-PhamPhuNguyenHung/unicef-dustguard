import { NormalizedFact, MissingFactItem } from '../types.js';

export interface SufficiencyResult {
  isSufficient: boolean;
  sufficiencyScore: number; // 0..100
  missingFacts: MissingFactItem[];
  satisfiedCriteria: string[];
}

export class EvidenceSufficiencyChecker {
  /**
   * Đánh giá tính đầy đủ của bộ chứng cứ số
   */
  public static checkSufficiency(facts: NormalizedFact[]): SufficiencyResult {
    const missingFacts: MissingFactItem[] = [];
    const satisfiedCriteria: string[] = [];

    const claims = facts.filter(f => f.semanticType === 'CLAIM');
    const observations = facts.filter(f => f.semanticType === 'OBSERVATION');
    const evidence = facts.filter(f => f.factType === 'EVIDENCE_ASSET');
    const verifiedEvidence = evidence.filter(e => e.integrityState === 'VERIFIED' && e.verificationState === 'VERIFIED');
    const tamperedEvidence = evidence.filter(e => e.integrityState === 'TAMPERED' || e.integrityState === 'FILE_MISSING');

    // 1. Kiểm tra Biên bản kiểm tra hiện trường
    const hasCompletedInspection = observations.some(
      o => o.verificationState === 'VERIFIED'
    );

    if (hasCompletedInspection) {
      satisfiedCriteria.push('Đã có biên bản kiểm tra hiện trường có hiệu lực');
    } else {
      missingFacts.push({
        fact: 'Biên bản kiểm tra hiện trường chính thức của đoàn thanh tra',
        reason_needed: 'Cần xác minh trực tiếp tại thực địa các biện pháp giảm thiểu bụi và hoạt động thi công',
        recommended_verification_action: 'Lập kế hoạch thanh tra hiện trường và phân công cán bộ khảo sát',
      });
    }

    // 2. Kiểm tra Ảnh minh chứng nguyên vẹn mã băm
    if (verifiedEvidence.length > 0) {
      satisfiedCriteria.push(`Đã có ${verifiedEvidence.length} tệp ảnh minh chứng toàn vẹn mã băm SHA-256`);
    } else {
      missingFacts.push({
        fact: 'Ảnh minh chứng hiện trường đã băm mật mã SHA-256',
        reason_needed: 'Cần chứng cứ số nguyên vẹn làm cơ sở đối chiếu pháp lý không thể chối bỏ',
        recommended_verification_action: 'Chụp và tải lên ảnh hiện trường có tọa độ và dấu thời gian',
      });
    }

    // 3. Kiểm tra Ảnh trạm rửa xe
    const mentionsWash = facts.some(f => (f.value || '').toLowerCase().includes('rửa xe'));
    const hasWashEvidence = verifiedEvidence.some(
      e => (e.title || '').toLowerCase().includes('wash') || (e.title || '').toLowerCase().includes('rửa xe')
    );

    if (mentionsWash) {
      if (hasWashEvidence) {
        satisfiedCriteria.push('Đã có ảnh đối chứng trạm rửa xe tự động');
      } else {
        missingFacts.push({
          fact: 'Ảnh chụp xác thực hoạt động của cầu/trạm rửa xe tại cổng ra vào',
          reason_needed: 'Khoản 1 Điều 15 Nghị định 45/2022/NĐ-CP yêu cầu phương tiện phải làm sạch bùn đất trước khi ra đường công cộng',
          recommended_verification_action: 'Yêu cầu cán bộ thanh tra chụp ảnh cận cảnh hệ thống rửa bánh xe khi thị sát',
        });
      }
    }

    // 4. Kiểm tra Ảnh che chắn lưới
    const hasMeshEvidence = verifiedEvidence.some(
      e => (e.title || '').toLowerCase().includes('mesh') || (e.title || '').toLowerCase().includes('lưới') || (e.title || '').toLowerCase().includes('che chắn')
    );
    if (hasMeshEvidence) {
      satisfiedCriteria.push('Đã có ảnh kiểm tra độ phủ lưới chống bụi');
    } else {
      missingFacts.push({
        fact: 'Ảnh chụp kiểm tra độ phủ và tình trạng lưới chống bụi toàn bộ chu vi công trình',
        reason_needed: 'Xác định mức độ che chắn theo quy chuẩn kỹ thuật xây dựng và môi trường',
        recommended_verification_action: 'Chụp ảnh toàn cảnh bao quát các mặt tiếp giáp khu dân cư',
      });
    }

    // 5. Cảnh báo tệp chứng cứ bị sửa đổi / mất
    if (tamperedEvidence.length > 0) {
      missingFacts.push({
        fact: `Xác thực lại ${tamperedEvidence.length} tệp chứng cứ bị mất hoặc sai lệch mã băm SHA-256`,
        reason_needed: 'Toàn vẹn chứng cứ số học bị gián đoạn, không thể sử dụng tệp bị can thiệp làm căn cứ pháp lý',
        recommended_verification_action: 'Yêu cầu cán bộ hiện trường kiểm tra lại tệp gốc kèm chữ ký số',
      });
    }

    const totalChecks = 4;
    const score = Math.round((satisfiedCriteria.length / totalChecks) * 100);
    const isSufficient = hasCompletedInspection && verifiedEvidence.length > 0 && tamperedEvidence.length === 0;

    return {
      isSufficient,
      sufficiencyScore: Math.min(100, score),
      missingFacts,
      satisfiedCriteria,
    };
  }
}
