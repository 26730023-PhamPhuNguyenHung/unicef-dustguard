import React from 'react';
import { ContributionSummaryModal, ContributionSummaryModalProps } from './ContributionSummaryModal.js';

export interface YouthCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userRole?: string;
  verifiedHours?: number;
  academicCredits?: number;
  totalActivitiesCount?: number;
}

/**
 * YouthCertificateModal — Backward compatible wrapper cho ContributionSummaryModal
 * Chuyển đổi định vị sang "Bản tổng kết đóng góp"
 */
export const YouthCertificateModal: React.FC<YouthCertificateModalProps> = ({
  isOpen,
  onClose,
  userName,
  userRole,
  verifiedHours = 0,
  totalActivitiesCount = 0,
}) => {
  return (
    <ContributionSummaryModal
      isOpen={isOpen}
      onClose={onClose}
      userName={userName}
      userRole={userRole}
      totalActivities={totalActivitiesCount}
      contributionHours={verifiedHours}
      verifiedActivities={totalActivitiesCount}
      resolvedCasesCount={0}
      locationsCount={1}
    />
  );
};

export default YouthCertificateModal;
