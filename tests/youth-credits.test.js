import test from 'node:test';
import assert from 'node:assert/strict';

// Logic test mô phỏng trực tiếp từ apps/web/src/utils/creditCalculator.ts (Contribution Engine)
function calculateItemHours(item) {
  let baseHours = 1.0;
  if (item.type === 'report') baseHours = 1.5;
  if (item.type === 'task' || item.type === 'verification') baseHours = 2.0;
  if (item.type === 'confirmation') baseHours = 0.5;

  let bonusHours = 0;
  if (item.hasEvidence) bonusHours += 0.5;
  if (item.hasSiteLinked) bonusHours += 0.5;
  if (item.isWithin50m) bonusHours += 0.5;
  if (item.isBeforeAfter) bonusHours += 1.0;

  let weight = 1.0;
  const s = String(item.status).toUpperCase();
  if (s === 'RESOLVED' || s === 'VERIFIED' || s === 'ACCEPTED' || s === 'COMPLETED' || s === 'CONFIRMED') {
    weight = 1.0;
  } else if (s === 'PENDING' || s === 'SUBMITTED' || s === 'REVIEWING') {
    weight = 0.8;
  } else if (s === 'REJECTED') {
    weight = 0;
  }

  return Number(((baseHours + bonusHours) * weight).toFixed(1));
}

function evaluateContributionSummary(contributions) {
  let totalHours = 0;
  let verifiedHours = 0;
  let pendingHours = 0;
  let verifiedCount = 0;
  let pendingCount = 0;

  const locationSet = new Set();
  const resolvedCaseIds = new Set();

  const logs = contributions.map((item) => {
    const hours = item.hours !== undefined ? item.hours : calculateItemHours(item);
    totalHours += hours;

    const s = String(item.status).toUpperCase();
    const isVerified = (
      s === 'RESOLVED' ||
      s === 'VERIFIED' ||
      s === 'ACCEPTED' ||
      s === 'COMPLETED' ||
      s === 'CONFIRMED'
    );

    if (isVerified) {
      verifiedHours += hours;
      verifiedCount += 1;
    } else {
      pendingHours += hours;
      pendingCount += 1;
    }

    const district = item.district || 'TP. Hồ Chí Minh';
    if (district) locationSet.add(district);

    if (item.caseId && (item.caseStatus === 'resolved' || item.caseStatus === 'closed' || s === 'RESOLVED')) {
      resolvedCaseIds.add(item.caseId);
    }

    return {
      id: item.id,
      code: item.code || `DG-${item.id.slice(0, 6).toUpperCase()}`,
      title: item.title || 'Đóng góp giám sát môi trường cộng đồng',
      type: item.type || 'report',
      hours,
      isVerified,
      statusText: isVerified ? 'Đã xác minh' : s === 'REJECTED' ? 'Từ chối' : 'Đang xử lý',
      district,
      createdAt: item.createdAt || new Date().toISOString(),
      caseId: item.caseId,
      caseStatus: item.caseStatus
    };
  });

  return {
    totalActivities: contributions.length,
    totalHours: Number(totalHours.toFixed(1)),
    verifiedHours: Number(verifiedHours.toFixed(1)),
    pendingHours: Number(pendingHours.toFixed(1)),
    verifiedCount,
    pendingCount,
    locationsCount: locationSet.size,
    resolvedCasesCount: resolvedCaseIds.size,
    logs,
  };
}

test('DẤU ẤN ĐÓNG GÓP: Contribution Hours & Community Impact Verification', async (t) => {
  await t.test('Phản ánh đầy đủ bằng chứng, định vị và đối chứng được ghi nhận 4.0 giờ thực tế', () => {
    const item = {
      id: 'rep-1',
      type: 'report', // base 1.5
      hasEvidence: true, // +0.5
      hasSiteLinked: true, // +0.5
      isWithin50m: true, // +0.5
      isBeforeAfter: true, // +1.0
      status: 'VERIFIED',
    };
    const hours = calculateItemHours(item);
    // 1.5 + 0.5 + 0.5 + 0.5 + 1.0 = 4.0 * 1.0 = 4.0
    assert.equal(hours, 4.0);
  });

  await t.test('Hoạt động đang xử lý ghi nhận 80% thời gian thực địa', () => {
    const item = {
      id: 'obs-2',
      type: 'observation', // base 1.0
      hasEvidence: true, // +0.5
      hasSiteLinked: false,
      isWithin50m: false,
      isBeforeAfter: false,
      status: 'PENDING',
    };
    const hours = calculateItemHours(item);
    // (1.0 + 0.5) * 0.8 = 1.2
    assert.equal(hours, 1.2);
  });

  await t.test('Tổng hợp số hoạt động, số giờ thực tế và số địa bàn không chia 20h hay 4.0 tín chỉ', () => {
    const list = [
      { id: '1', type: 'report', hasEvidence: true, hasSiteLinked: true, isWithin50m: true, isBeforeAfter: true, status: 'VERIFIED', district: 'Quận 7', caseId: 'c1', caseStatus: 'resolved' }, // 4.0
      { id: '2', type: 'observation', hasEvidence: true, hasSiteLinked: false, isWithin50m: false, isBeforeAfter: false, status: 'VERIFIED', district: 'Bình Thạnh', caseId: 'c2', caseStatus: 'in_progress' }, // 1.5
      { id: '3', type: 'confirmation', hasEvidence: false, hasSiteLinked: false, isWithin50m: false, isBeforeAfter: false, status: 'CONFIRMED', district: 'TP. Thủ Đức', caseId: 'c3', caseStatus: 'resolved' }, // 0.5
    ];
    const res = evaluateContributionSummary(list);
    assert.equal(res.totalActivities, 3);
    assert.equal(res.verifiedCount, 3);
    assert.equal(res.verifiedHours, 6.0);
    assert.equal(res.locationsCount, 3);
    assert.equal(res.resolvedCasesCount, 2);
  });

  await t.test('Xác định đúng tác động và trạng thái khi có vụ việc hoàn tất', () => {
    const list = [
      { id: '1', type: 'report', status: 'VERIFIED', district: 'Quận 7', caseId: 'case-alpha', caseStatus: 'resolved' },
      { id: '2', type: 'confirmation', status: 'CONFIRMED', district: 'Quận 7', caseId: 'case-alpha', caseStatus: 'resolved' },
    ];
    const res = evaluateContributionSummary(list);
    assert.equal(res.resolvedCasesCount, 1, 'Hai đóng góp cùng 1 case resolved chỉ tính 1 case');
    assert.equal(res.locationsCount, 1);
  });
});
