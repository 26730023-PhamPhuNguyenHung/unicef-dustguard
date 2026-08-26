# DOMAIN SSOT — BOUNDED CONTEXTS & AGGREGATE ROOTS

## 1. Bounded Contexts

```text
src/domains/ (hoặc server/domain/)
  ├── community/       # Nhóm, CLB, thành viên, vai trò (Member, Coordinator, Admin)
  ├── campaigns/       # Chiến dịch hành động xanh, mục tiêu, địa bàn, thời hạn
  ├── observations/    # Ghi nhận hiện trường ban đầu (ảnh, GPS, danh mục, mô tả)
  ├── cases/           # Vấn đề hệ thống hóa theo dõi lâu dài (status, priority, owner)
  ├── evidence/        # Kho minh chứng số (URL, hash SHA-256, timestamps, metadata)
  ├── actions/         # Nhiệm vụ cụ thể (TODO, IN_PROGRESS, DONE, CANCELLED)
  ├── followups/       # Quay lại kiểm tra (Tốt hơn / Không đổi / Xấu hơn, ảnh mới)
  ├── handoffs/        # Chuyển thông tin tới đơn vị phụ trách (Prepared -> Closed)
  └── impact/          # Số liệu tác động xã hội & môi trường có thực
```

## 2. Aggregate Roots & Key Entities

### A. Community
- `id`, `name`, `type` (`UNIVERSITY_CLUB`, `YOUTH_UNION`, `NGO_VOLUNTEER`, `LOCAL_COMMUNITY`), `ward`, `city`, `avatarUrl`, `description`, `createdAt`.
- **CommunityMember**: `id`, `communityId`, `userId`, `role` (`MEMBER`, `COORDINATOR`, `ADMIN`), `joinedAt`.

### B. Campaign
- `id`, `code`, `title`, `description`, `topic` (`SCHOOL_ZONE_DUST`, `OPEN_BURNING_WATCH`, `CANAL_CLEANUP`, `GREEN_YOUTH_MONTH`), `ward`, `city`, `startDate`, `endDate`, `status` (`DRAFT`, `ACTIVE`, `COMPLETED`, `ARCHIVED`), `createdById`.

### C. Observation (Aggregate Root)
- `id`, `code` (`OBS-2026-XXXX`), `category` (`CONSTRUCTION_DUST`, `WASTE`, `WASTEWATER`, `OPEN_BURNING`, `AGRICULTURAL_CHEMICAL`, `AIR_QUALITY`, `OTHER`), `latitude`, `longitude`, `address`, `ward`, `city`, `description`, `reporterType` (`INDIVIDUAL`, `CLUB`, `VOLUNTEER`, `CAMPAIGN`), `reporterName`, `reporterPhone`, `communityId`, `campaignId`, `status` (`RECORDED`, `VERIFYING`, `FOLLOWING_UP`, `CONVERTED_CASE`, `RESOLVED`), `createdAt`, `updatedAt`.
- **ObservationEvidence**: `id`, `observationId`, `url`, `type`, `sha256`, `createdAt`.

### D. Case (Aggregate Root)
- `id`, `code` (`CASE-2026-XXXX`), `title`, `description`, `category`, `priority` (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`), `priorityScore` (0-100), `status` (`MONITORING`, `IN_PROGRESS`, `HANDED_OFF`, `RESOLVED`, `CLOSED`), `siteId`, `communityId`, `campaignId`, `slaDeadline`, `createdAt`, `updatedAt`.
- **CaseObservation**: `id`, `caseId`, `observationId`.

### E. Action
- `id`, `caseId`, `observationId`, `title`, `description`, `assignedTo`, `dueAt`, `status` (`TODO`, `IN_PROGRESS`, `DONE`, `CANCELLED`), `completionEvidenceUrl`, `completedAt`.

### F. FollowUp
- `id`, `caseId`, `observationId`, `performedBy`, `outcomeStatus` (`BETTER`, `UNCHANGED`, `WORSE`, `UNKNOWN`), `notes`, `evidenceUrl`, `evidenceSha256`, `verifiedAt`, `createdAt`.

### G. Handoff
- `id`, `caseId`, `recipientUnit`, `recipientContact`, `channel` (`EMAIL`, `WEBSITE`, `HOTLINE`, `DIRECT`, `OTHER`), `status` (`PREPARED`, `SENT`, `ACKNOWLEDGED`, `FOLLOW_UP_NEEDED`, `CLOSED`), `summaryMarkdown`, `dossierUrl`, `hash`, `sentAt`, `acknowledgedAt`, `closedAt`.

### H. Impact
- `id`, `communityId`, `userId`, `eventType` (`OBSERVATION_CREATED`, `EVIDENCE_ATTACHED`, `FOLLOW_UP_RECORDED`, `ACTION_COMPLETED`, `CASE_RESOLVED`, `HANDOFF_DISPATCHED`), `pointsEarned`, `volunteerHours`, `metadataJson`, `createdAt`.

## 3. Extensibility Invariant
- Không khóa cứng hệ thống vào duy nhất Bụi PM2.5. Danh mục môi trường mở rộng qua Enum/Config `ENVIRONMENTAL_CATEGORIES`.
- IoT là nguồn phụ trợ (Corroborating Signal), hệ thống hoàn toàn vận hành đầy đủ khi có 0 cảm biến.
- AI đóng vai trò trợ lý (Assistant): Phân loại, tóm tắt, phát hiện trường thiếu, đề xuất hành động tiếp theo — Không tự động tuyên phạt hay đưa ra phán quyết pháp lý.
- Tín chỉ ngoại khóa & Điểm rèn luyện: Là tính năng tùy chọn (Optional) và đang trong lộ trình thử nghiệm (Sớm ra mắt), không phải điều kiện tiên quyết đối với cộng đồng.
