# NEXT ACTIONS

1. **Phase 2 & 3 (Domain & Backend)**:
   - Triển khai Additive D1 Migration & Repositories cho `communities`, `campaigns`, `observations`, `follow_ups`, `handoffs`, `impact_events`.
   - Bổ sung các worker API endpoints trong `app/server/worker.js`.
2. **Phase 4 & 5 (Community Portal UI)**:
   - Tạo routing `/community/*` trong `app/src/App.jsx`.
   - Triển khai các màn hình UI: `CommunityHome`, `CreateObservation`, `ObservationDetail`, `CommunityCases`, `CommunityCaseWorkspace`, `CommunityFollowUps`, `CommunityActions`, `CommunityImpact`.
3. **Phase 6 (Landing Redesign)**:
   - Cập nhật `app/landing.html` và `LandingPage.jsx` theo đúng pivot: Thanh niên / CLB Môi trường làm hạt nhân trung tâm.
4. **Phase 7 (Verification & Tests)**:
   - Thêm bộ test cho domain mới, chạy `npm run verify` kiểm tra toàn diện.
