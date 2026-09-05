import { NormalizedFact, Contradiction, SensorQualityMetric } from '../types.js';

export class ContradictionDetector {
  /**
   * Quét và phát hiện các mâu thuẫn chéo giữa các nguồn dữ kiện
   */
  public static detectContradictions(
    facts: NormalizedFact[],
    sensorQuality: SensorQualityMetric | null
  ): Contradiction[] {
    const contradictions: Contradiction[] = [];

    const claims = facts.filter(f => f.semanticType === 'CLAIM');
    const observations = facts.filter(f => f.semanticType === 'OBSERVATION');
    const evidenceAssets = facts.filter(f => f.factType === 'EVIDENCE_ASSET');
    const telemetry = facts.filter(f => f.semanticType === 'TELEMETRY');

    // 1. Mâu thuẫn toàn vẹn chứng cứ số học (Integrity Violation)
    const tamperedEvidence = evidenceAssets.filter(
      e => e.integrityState === 'TAMPERED' || e.integrityState === 'FILE_MISSING'
    );
    if (tamperedEvidence.length > 0) {
      contradictions.push({
        id: 'CTR-INTEGRITY-01',
        type: 'INTEGRITY_VIOLATION',
        severity: 'CRITICAL',
        title: 'Cảnh báo toàn vẹn: Tệp chứng cứ số bị sai lệch hoặc thất lạc',
        description: `Phát hiện ${tamperedEvidence.length} tệp hình ảnh/tài liệu đính kèm có mã băm SHA-256 không khớp với dữ liệu gốc hoặc đã bị xóa khỏi kho lưu trữ.`,
        recommendation: 'Lập tức loại bỏ các tệp bị can thiệp khỏi căn cứ pháp lý; yêu cầu cán bộ lập lại biên bản hiện trường kèm chữ ký số mới.',
        sourceIds: tamperedEvidence.map(e => e.id),
      });
    }

    // 2. Mâu thuẫn giữa Cảm biến quan trắc và Biên bản thực địa
    if (sensorQuality && sensorQuality.status === 'INVALID') {
      contradictions.push({
        id: 'CTR-SENSOR-01',
        type: 'OBSERVATION_VS_TELEMETRY',
        severity: 'HIGH',
        title: 'Dữ liệu viễn thám không đáng tin cậy',
        description: `Chuỗi đo trạm quan trắc phát hiện lỗi chất lượng nghiêm trọng (${sensorQuality.reasons.join(', ')}). Không thể dùng làm bằng chứng đối chiếu.`,
        recommendation: 'Cử kỹ thuật viên bảo dưỡng trạm đo, tạm thời dựa vào phương pháp đo kiểm hiện trường thủ công.',
        sourceIds: telemetry.map(t => t.id),
      });
    }

    // 3. Mâu thuẫn giữa Phản ánh người dân và Biên bản kiểm tra
    const hasPassedInspection = observations.some(
      o => o.metadata?.status === 'PASS'
    );
    const hasHeavyClaims = claims.some(
      c => (c.metadata?.reportCount || 1) >= 3 || (c.value || '').toLowerCase().includes('mù mịt')
    );

    if (hasHeavyClaims && hasPassedInspection) {
      const passItems = observations.filter(o => o.metadata?.status === 'PASS');
      contradictions.push({
        id: 'CTR-CLAIM-INSP-01',
        type: 'CLAIM_VS_INSPECTION',
        severity: 'MEDIUM',
        title: 'Bất đồng dữ kiện: Phản ánh cộng đồng mâu thuẫn kết quả kiểm tra',
        description: 'Người dân liên tục phản ánh bụi đậm đặc, tuy nhiên biên bản kiểm tra thực địa gần nhất lại đánh giá các hạng mục đạt chuẩn (PASS). Có thể do kiểm tra lệch giờ thi công cao điểm.',
        recommendation: 'Tổ chức phúc tra đột xuất vào đúng khung giờ người dân thường xuyên phản ánh (ví dụ giờ vận chuyển xe ben ban đêm).',
        sourceIds: [...claims.map(c => c.id), ...passItems.map(p => p.id)],
      });
    }

    // 4. Mâu thuẫn: Hoạt động trạm rửa xe không có ảnh minh chứng
    const mentionsWash = facts.some(f => (f.value || '').toLowerCase().includes('rửa xe'));
    const verifiedEvidence = evidenceAssets.filter(e => e.integrityState === 'VERIFIED');
    const hasWashPhoto = verifiedEvidence.some(
      e => (e.title || '').toLowerCase().includes('wash') || (e.title || '').toLowerCase().includes('rửa xe')
    );

    if (mentionsWash && !hasWashPhoto) {
      contradictions.push({
        id: 'CTR-WASH-01',
        type: 'CLAIM_VS_INSPECTION',
        severity: 'LOW',
        title: 'Thiếu chứng cứ đối chứng: Trạm rửa xe tại cổng công trình',
        description: 'Quy chuẩn Điều 15 NĐ 45/2022 yêu cầu xe ra khỏi công trình phải được rửa sạch, nhưng hồ sơ chưa có ảnh chụp hoặc video đối chứng trạm rửa xe đang vận hành thực tế.',
        recommendation: 'Yêu cầu cán bộ chụp ảnh cận cảnh cầu rửa xe và vòi phun áp lực khi làm việc tại hiện trường.',
        sourceIds: claims.map(c => c.id),
      });
    }

    return contradictions;
  }
}
