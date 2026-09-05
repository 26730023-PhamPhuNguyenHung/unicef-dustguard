import { NormalizedFact, EvidenceMatrixRow, MissingFactItem } from '../types.js';

export class EvidenceMatrixBuilder {
  /**
   * Xây dựng ma trận chứng cứ đối chứng 2 chiều
   */
  public static buildMatrix(
    facts: NormalizedFact[],
    findings: { id: string; statement: string; sourceIds: string[]; legalSectionIds: string[]; confidence: number }[],
    legalMap: Map<string, any>,
    missingFacts: MissingFactItem[]
  ): EvidenceMatrixRow[] {
    const matrix: EvidenceMatrixRow[] = [];

    for (const f of findings) {
      const matchedSources = facts
        .filter(fact => f.sourceIds.includes(fact.id))
        .map(fact => ({
          id: fact.id,
          title: fact.title,
          semanticType: fact.semanticType,
          verificationState: fact.verificationState,
          integrityState: fact.integrityState,
        }));

      const matchedLegal = f.legalSectionIds
        .map(secId => legalMap.get(secId))
        .filter(Boolean)
        .map(sec => ({
          id: sec.id,
          number: `${sec.section_number} (${sec.document_number || 'NĐ'})`,
          heading: sec.heading,
          excerpt: (sec.content || '').substring(0, 150) + '...',
        }));

      const hasTampered = matchedSources.some(s => s.integrityState === 'TAMPERED' || s.integrityState === 'FILE_MISSING');
      const allVerified = matchedSources.every(s => s.verificationState === 'VERIFIED' && s.integrityState === 'VERIFIED');

      let verificationStatus = 'CHƯA XÁC MINH';
      if (hasTampered) {
        verificationStatus = 'PHÁT HIỆN TỆP BỊ CAN THIỆP';
      } else if (allVerified && matchedSources.length > 0) {
        verificationStatus = 'ĐÃ ĐỐI CHỨNG TOÀN VẸN';
      } else if (matchedSources.some(s => s.verificationState === 'VERIFIED')) {
        verificationStatus = 'XÁC MINH MỘT PHẦN';
      }

      matrix.push({
        findingId: f.id,
        statement: f.statement,
        sources: matchedSources,
        legalProvisions: matchedLegal,
        verificationStatus,
        missingItems: missingFacts.map(m => m.fact),
        confidence: f.confidence,
        requiresHumanReview: true,
      });
    }

    return matrix;
  }
}
