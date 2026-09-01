import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CASE_STEPS_SEQUENCE,
  ALLOWED_TRANSITIONS,
  validateCaseTransition,
  calculateSlaDeadline,
  calculateHaversineDistance,
  isWithinGeofence,
  QCVN_CHECKLIST_CRITERIA
} from '../src/index.js';

test('1. CASE_STEPS_SEQUENCE contains exactly 7 sequential steps', () => {
  assert.equal(CASE_STEPS_SEQUENCE.length, 7);
  assert.equal(CASE_STEPS_SEQUENCE[0], 'SCREENING');
  assert.equal(CASE_STEPS_SEQUENCE[6], 'COMPLETED');
});

test('2. validateCaseTransition enforces sequential progression and blocks backward/illegal jumps', () => {
  // Valid progression
  assert.doesNotThrow(() => validateCaseTransition('SCREENING', 'PREPARING'));
  assert.doesNotThrow(() => validateCaseTransition('PREPARING', 'DECISION_ISSUED'));

  // Illegal jumps
  assert.throws(() => validateCaseTransition('SCREENING', 'COMPLETED'), /Chuyển bước không hợp lệ/);
  assert.throws(() => validateCaseTransition('ON_SITE', 'SCREENING'), /Chuyển bước không hợp lệ/);
});

test('3. calculateSlaDeadline calculates deterministic hours and deadlines', () => {
  const base = new Date('2026-09-01T08:00:00.000Z');
  
  const critical = calculateSlaDeadline('CRITICAL', base);
  assert.equal(critical.hours, 4);
  assert.equal(critical.deadlineIso, '2026-09-01T12:00:00.000Z');

  const high = calculateSlaDeadline('HIGH', base);
  assert.equal(high.hours, 24);
  assert.equal(high.deadlineIso, '2026-09-02T08:00:00.000Z');
});

test('4. Haversine distance and geofence evaluation are accurate', () => {
  // Same coordinate
  assert.equal(calculateHaversineDistance(21.000, 105.800, 21.000, 105.800), 0);
  
  // ~30m distance
  const checkWithin = isWithinGeofence(21.0000, 105.8000, 21.0002, 105.8000, 50);
  assert.equal(checkWithin.withinGeofence, true);
  assert.ok(checkWithin.distanceMeters <= 50);

  // Far distance > 500m
  const checkFar = isWithinGeofence(21.0000, 105.8000, 21.0100, 105.8000, 50);
  assert.equal(checkFar.withinGeofence, false);
});

test('5. QCVN_CHECKLIST_CRITERIA defines exactly 10 mandatory criteria', () => {
  assert.equal(QCVN_CHECKLIST_CRITERIA.length, 10);
  assert.ok(QCVN_CHECKLIST_CRITERIA.every(c => c.id && c.title && c.standard));
});
