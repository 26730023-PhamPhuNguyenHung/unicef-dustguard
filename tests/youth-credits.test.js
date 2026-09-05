import test from 'node:test';
import assert from 'node:assert/strict';

// Logic test mô phỏng trực tiếp từ apps/web/src/utils/creditCalculator.ts
function calculateItemHours(item) {
  let baseHours = 1.5;
  let bonusHours = 0;

  if (item.hasEvidence) bonusHours += 0.5;
  if (item.hasSiteLinked) bonusHours += 0.5;
  if (item.isWithin50m) bonusHours += 0.5;
  if (item.isBeforeAfter) bonusHours += 1.0;

  let weight = 0;
  if (item.status === 'RESOLVED' || item.status === 'VERIFIED') {
    weight = 1.0;
  } else if (item.status === 'PENDING') {
    weight = 0.5;
  } else {
    weight = 0;
  }

  return Number(((baseHours + bonusHours) * weight).toFixed(1));
}

function evaluateYouthCredits(contributions) {
  let totalHours = 0;
  let verifiedHours = 0;
  let pendingHours = 0;

  const logs = contributions.map((item) => {
    const hours = calculateItemHours(item);
    totalHours += hours;

    const isVerified = item.status === 'RESOLVED' || item.status === 'VERIFIED';
    if (isVerified) {
      verifiedHours += hours;
    } else if (item.status === 'PENDING') {
      pendingHours += hours;
    }

    return {
      id: item.id,
      code: item.code || `DG-${item.id.slice(0, 6).toUpperCase()}`,
      title: item.title || 'Đóng góp giám sát môi trường cộng đồng',
      type: item.type || 'report',
      hours,
      isVerified,
      statusText: isVerified ? 'Đã xác nhận' : item.status === 'PENDING' ? 'Đang thẩm tra' : 'Từ chối',
      createdAt: item.createdAt || new Date().toISOString(),
    };
  });

  const verifiedRounded = Number(verifiedHours.toFixed(1));
  const academicCredits = Math.min(4.0, Number(((verifiedRounded / 20) * 4.0).toFixed(1)));
  const progressPercentage = Math.min(100, Math.round((verifiedRounded / 20) * 100));
  const hoursToNextMilestone = Math.max(0, Number((20 - verifiedRounded).toFixed(1)));

  return {
    totalHours: Number(totalHours.toFixed(1)),
    verifiedHours: verifiedRounded,
    pendingHours: Number(pendingHours.toFixed(1)),
    academicCredits,
    progressPercentage,
    hoursToNextMilestone,
    logs,
  };
}

test('GAP-05 & GAP-06: Youth Credits & Volunteer Hours Calculation', async (t) => {
  await t.test('Hoạt động đầy đủ bằng chứng, định vị và đối chứng đạt tối đa 4.0h', () => {
    const item = {
      id: 'task-1',
      hasEvidence: true,
      hasSiteLinked: true,
      isWithin50m: true,
      isBeforeAfter: true,
      status: 'VERIFIED',
    };
    const hours = calculateItemHours(item);
    // 1.5 + 0.5 + 0.5 + 0.5 + 1.0 = 4.0 * 1.0 = 4.0
    assert.equal(hours, 4.0);
  });

  await t.test('Hoạt động đang chờ duyệt chỉ tính 50% trọng số', () => {
    const item = {
      id: 'task-2',
      hasEvidence: true,
      hasSiteLinked: false,
      isWithin50m: false,
      isBeforeAfter: false,
      status: 'PENDING',
    };
    const hours = calculateItemHours(item);
    // (1.5 + 0.5) * 0.5 = 1.0
    assert.equal(hours, 1.0);
  });

  await t.test('Quy đổi chuẩn 20 giờ = 4.0 tín chỉ rèn luyện', () => {
    const list = [
      { id: '1', hasEvidence: true, hasSiteLinked: true, isWithin50m: true, isBeforeAfter: true, status: 'VERIFIED' }, // 4.0
      { id: '2', hasEvidence: true, hasSiteLinked: true, isWithin50m: true, isBeforeAfter: true, status: 'VERIFIED' }, // 4.0
      { id: '3', hasEvidence: true, hasSiteLinked: true, isWithin50m: true, isBeforeAfter: true, status: 'VERIFIED' }, // 4.0
      { id: '4', hasEvidence: true, hasSiteLinked: true, isWithin50m: true, isBeforeAfter: true, status: 'VERIFIED' }, // 4.0
      { id: '5', hasEvidence: true, hasSiteLinked: true, isWithin50m: true, isBeforeAfter: true, status: 'VERIFIED' }, // 4.0
    ];
    const res = evaluateYouthCredits(list);
    assert.equal(res.verifiedHours, 20.0);
    assert.equal(res.academicCredits, 4.0);
    assert.equal(res.progressPercentage, 100);
    assert.equal(res.hoursToNextMilestone, 0);
  });

  await t.test('Không vượt quá 4.0 tín chỉ khi vượt 20 giờ', () => {
    const list = [
      { id: '1', hasEvidence: true, hasSiteLinked: true, isWithin50m: true, isBeforeAfter: true, status: 'VERIFIED' }, // 4.0
      { id: '2', hasEvidence: true, hasSiteLinked: true, isWithin50m: true, isBeforeAfter: true, status: 'VERIFIED' }, // 4.0
      { id: '3', hasEvidence: true, hasSiteLinked: true, isWithin50m: true, isBeforeAfter: true, status: 'VERIFIED' }, // 4.0
      { id: '4', hasEvidence: true, hasSiteLinked: true, isWithin50m: true, isBeforeAfter: true, status: 'VERIFIED' }, // 4.0
      { id: '5', hasEvidence: true, hasSiteLinked: true, isWithin50m: true, isBeforeAfter: true, status: 'VERIFIED' }, // 4.0
      { id: '6', hasEvidence: true, hasSiteLinked: true, isWithin50m: true, isBeforeAfter: true, status: 'VERIFIED' }, // 4.0
    ];
    const res = evaluateYouthCredits(list);
    assert.equal(res.verifiedHours, 24.0);
    assert.equal(res.academicCredits, 4.0); // Cap 4.0
    assert.equal(res.progressPercentage, 100);
    assert.equal(res.hoursToNextMilestone, 0);
  });
});
