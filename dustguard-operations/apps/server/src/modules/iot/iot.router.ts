import { Router, Request, Response } from 'express';
import crypto from 'node:crypto';
import { query, queryOne, run, transaction } from '../../db/connection.js';
import { requireAuth } from '../../middleware/auth.js';
import { dispatchAutomationEvent } from '../automations/automations.service.js';

export const iotRouter = Router();

// Constant-time HMAC comparison
function timingSafeEqual(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  } catch (e) {
    return false;
  }
}

// Build Canonical Message according to ESP32 Firmware RequestSigner.cpp
function buildCanonicalMessage(sensorCode: string, pm10: number, pm25: number, timestamp: string): string {
  const p10Str = Number(pm10).toFixed(1);
  const p25Str = Number(pm25).toFixed(1);
  return `${sensorCode}:${p10Str}:${p25Str}:${timestamp}`;
}

// 1. List Devices
iotRouter.get('/devices', requireAuth, (req: Request, res: Response) => {
  const devices = query<any>(`
    SELECT d.*,
      (SELECT pm25 FROM iot_readings WHERE device_id = d.id ORDER BY recorded_at DESC LIMIT 1) as latest_pm25,
      (SELECT pm10 FROM iot_readings WHERE device_id = d.id ORDER BY recorded_at DESC LIMIT 1) as latest_pm10,
      (SELECT recorded_at FROM iot_readings WHERE device_id = d.id ORDER BY recorded_at DESC LIMIT 1) as latest_reading_at
    FROM iot_devices d
    ORDER BY d.created_at DESC
  `);

  // Dynamically evaluate liveness (>15m offline timeout)
  const now = Date.now();
  const processed = devices.map(d => {
    let effectiveStatus = d.status;
    if (d.last_seen_at) {
      const ageMs = now - new Date(d.last_seen_at).getTime();
      if (ageMs > 15 * 60 * 1000 && d.status === 'ONLINE') {
        effectiveStatus = 'OFFLINE';
      }
    }
    return {
      ...d,
      status: effectiveStatus,
    };
  });

  res.json({ success: true, data: processed, devices: processed });
});

// 2. Device Detail
iotRouter.get('/devices/:id', requireAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const device = queryOne<any>(`SELECT * FROM iot_devices WHERE id = ? OR device_code = ?`, [id, id]);
  if (!device) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Không tìm thấy thiết bị IoT' } });
    return;
  }

  // Fetch latest 50 readings
  const readings = query<any>(
    `SELECT * FROM iot_readings WHERE device_id = ? ORDER BY recorded_at DESC LIMIT 50`,
    [device.id]
  );

  // Fetch events
  const events = query<any>(
    `SELECT * FROM iot_events WHERE device_id = ? ORDER BY created_at DESC LIMIT 20`,
    [device.id]
  );

  // Fetch real related cases linked via case_signals or direct source
  const relatedCases = query<any>(
    `SELECT c.*, cs.linked_at, cs.notes as link_notes
     FROM cases c
     JOIN case_signals cs ON c.id = cs.case_id
     JOIN signals s ON cs.signal_id = s.id
     WHERE s.source_type = 'IOT' AND (s.external_source_id = ? OR s.external_source_id = ?)
     UNION
     SELECT c.*, c.created_at as linked_at, 'Nguồn phát hiện trực tiếp' as link_notes
     FROM cases c
     WHERE c.source = 'IOT' AND (c.source_reference = ? OR c.source_reference = ?)
     ORDER BY updated_at DESC LIMIT 10`,
    [device.id, device.device_code, device.id, device.device_code]
  );

  const payload = {
    device,
    latestReading: readings[0] || null,
    recentEvents: events,
    relatedCases,
    readings,
    events,
    nearbySignals,
    ...device,
  };

  res.json({
    success: true,
    data: payload,
    ...payload,
  });
});

// 2b. Create Case from IoT Anomaly
iotRouter.post('/devices/:id/create-case', requireAuth, (req: any, res: Response) => {
  const { id } = req.params;
  const { title, description, priority = 'HIGH' } = req.body;
  const device = queryOne<any>(`SELECT * FROM iot_devices WHERE id = ? OR device_code = ?`, [id, id]);
  if (!device) {
    res.status(404).json({ success: false, error: 'Không tìm thấy thiết bị IoT' });
    return;
  }

  const caseId = `case-${crypto.randomUUID().substring(0, 8)}`;
  const countRow = queryOne<{ c: number }>(`SELECT count(*) as c FROM cases`);
  const nextNum = (countRow?.c || 0) + 1;
  const case_code = `DG-2026-OP-${String(nextNum).padStart(3, '0')}`;

  const caseTitle = title || `Cảnh báo ô nhiễm bụi từ trạm quan trắc ${device.name} (${device.device_code})`;
  const caseDesc = description || `Hệ thống tự động ghi nhận cảnh báo bất thường/vượt ngưỡng từ trạm quan trắc ${device.name} tại ${device.location_text || 'vị trí đặt trạm'}. Cần điều phối cán bộ xác minh thực địa.`;

  transaction(() => {
    // 1. Insert Case
    run(
      `INSERT INTO cases (id, case_code, title, description, location_text, district, latitude, longitude, source, source_reference, priority, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'IOT', ?, ?, 'NEW', datetime('now'), datetime('now'))`,
      [
        caseId,
        case_code,
        caseTitle,
        caseDesc,
        device.location_text || 'Khu vực đặt cảm biến',
        device.district || 'Thành phố Thủ Đức',
        device.latitude || 10.8231,
        device.longitude || 106.6297,
        device.device_code,
        priority,
      ]
    );

    // 2. Insert Signal
    const signalId = `sig-${crypto.randomUUID().substring(0, 8)}`;
    run(
      `INSERT INTO signals (id, source_type, external_source_id, signal_type, title, description, location_text, latitude, longitude, observed_at, received_at, integrity_status, created_at)
       VALUES (?, 'IOT', ?, 'SENSOR_ANOMALY', ?, ?, ?, ?, ?, datetime('now'), datetime('now'), 'VALID', datetime('now'))`,
      [
        signalId,
        device.device_code,
        caseTitle,
        caseDesc,
        device.location_text || '',
        device.latitude || 10.8231,
        device.longitude || 106.6297,
      ]
    );

    // 3. Link Case & Signal
    run(
      `INSERT INTO case_signals (id, case_id, signal_id, linked_at, linked_by, notes)
       VALUES (?, ?, ?, datetime('now'), ?, 'Tự động liên kết từ trạm quan trắc')`,
      [`cs-${crypto.randomUUID().substring(0, 8)}`, caseId, signalId, req.user?.id || null]
    );

    // 4. Create Initial Triage/Verification Task
    const taskId = `task-${crypto.randomUUID().substring(0, 8)}`;
    const dueAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    run(
      `INSERT INTO tasks (id, case_id, title, description, task_type, source, source_entity_type, source_entity_id, status, priority, due_at, created_at)
       VALUES (?, ?, ?, ?, 'VERIFICATION', 'IOT', 'iot_devices', ?, 'OPEN', ?, ?, datetime('now'))`,
      [
        taskId,
        caseId,
        `Xác minh bất thường nồng độ bụi trạm ${device.device_code}`,
        `Cán bộ khẩn trương kiểm tra thực địa xung quanh trạm đo ${device.name} để xác định nguồn phát tán bụi và công trình lân cận.`,
        device.id,
        priority,
        dueAt,
      ]
    );

    // 5. Timeline
    run(
      `INSERT INTO case_timeline (id, case_id, event_type, actor_id, actor_name, actor_role, stage, description, created_at)
       VALUES (?, ?, 'CASE_CREATED_FROM_IOT', ?, ?, ?, 'INTAKE', ?, datetime('now'))`,
      [
        `tml-${crypto.randomUUID().substring(0, 8)}`,
        caseId,
        req.user?.id || 'system',
        req.user?.full_name || 'Hệ thống IoT',
        req.user?.role || 'system',
        `Hồ sơ được khởi tạo từ cảnh báo trạm quan trắc ${device.name} (${device.device_code}).`,
      ]
    );
  });

  const createdCase = queryOne(`SELECT * FROM cases WHERE id = ?`, [caseId]);
  res.status(201).json({ success: true, case: createdCase });
});

// 2c. Link IoT Device to Existing Case
iotRouter.post('/devices/:id/link-case', requireAuth, (req: any, res: Response) => {
  const { id } = req.params;
  const { case_id, notes } = req.body;
  if (!case_id) {
    res.status(400).json({ success: false, error: 'Thiếu mã hồ sơ vụ việc case_id' });
    return;
  }
  const device = queryOne<any>(`SELECT * FROM iot_devices WHERE id = ? OR device_code = ?`, [id, id]);
  if (!device) {
    res.status(404).json({ success: false, error: 'Không tìm thấy thiết bị IoT' });
    return;
  }
  const targetCase = queryOne<any>(`SELECT * FROM cases WHERE id = ?`, [case_id]);
  if (!targetCase) {
    res.status(404).json({ success: false, error: 'Không tìm thấy hồ sơ vụ việc' });
    return;
  }

  // Insert Signal
  const signalId = `sig-${crypto.randomUUID().substring(0, 8)}`;
  run(
    `INSERT INTO signals (id, source_type, external_source_id, signal_type, title, description, location_text, latitude, longitude, observed_at, received_at, integrity_status, created_at)
     VALUES (?, 'IOT', ?, 'SENSOR_DATA', ?, ?, ?, ?, ?, datetime('now'), datetime('now'), 'VALID', datetime('now'))`,
    [
      signalId,
      device.device_code,
      `Dữ liệu từ trạm ${device.name}`,
      `Liên kết dữ liệu cảm biến trạm ${device.device_code} vào hồ sơ ${targetCase.case_code}`,
      device.location_text || '',
      device.latitude || 10.8231,
      device.longitude || 106.6297,
    ]
  );

  run(
    `INSERT OR IGNORE INTO case_signals (id, case_id, signal_id, linked_at, linked_by, notes)
     VALUES (?, ?, ?, datetime('now'), ?, ?)`,
    [`cs-${crypto.randomUUID().substring(0, 8)}`, case_id, signalId, req.user?.id || null, notes || 'Liên kết trạm quan trắc bổ sung chứng cứ']
  );

  run(
    `INSERT INTO case_timeline (id, case_id, event_type, actor_id, actor_name, actor_role, stage, description, created_at)
     VALUES (?, ?, 'IOT_DEVICE_LINKED', ?, ?, ?, 'MONITORING', ?, datetime('now'))`,
    [
      `tml-${crypto.randomUUID().substring(0, 8)}`,
      case_id,
      req.user?.id || 'system',
      req.user?.full_name || 'Cán bộ vận hành',
      req.user?.role || 'staff',
      `Đã liên kết dữ liệu giám sát từ trạm ${device.name} (${device.device_code}) vào hồ sơ vụ việc.`,
    ]
  );

  res.json({ success: true, message: 'Đã liên kết trạm quan trắc vào vụ việc thành công' });
});

// 3. Historical Readings
iotRouter.get('/devices/:id/readings', requireAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const limit = Math.min(Number(req.query.limit) || 100, 500);

  const readings = query<any>(
    `SELECT * FROM iot_readings WHERE device_id = ? ORDER BY recorded_at DESC LIMIT ?`,
    [id, limit]
  );

  res.json({ success: true, data: readings, readings });
});

// 4. Ingest Route (Firmware APM2000 / ESP32 Endpoint)
iotRouter.post('/ingest', (req: Request, res: Response) => {
  const { sensorCode, pm10, pm25, timestamp, signature, temperature, humidity } = req.body;

  if (!sensorCode || pm10 === undefined || pm25 === undefined || !timestamp || !signature) {
    res.status(400).json({
      success: false,
      error: { code: 'INVALID_PAYLOAD', message: 'Payload thiếu trường bắt buộc (sensorCode, pm10, pm25, timestamp, signature)' },
    });
    return;
  }

  const device = queryOne<any>(`SELECT * FROM iot_devices WHERE device_code = ?`, [sensorCode]);
  if (!device) {
    res.status(403).json({
      success: false,
      error: { code: 'DEVICE_NOT_REGISTERED', message: 'Thiết bị trạm đo chưa được đăng ký trong hệ thống' },
    });
    return;
  }

  // 1. Verify HMAC-SHA256
  const canonicalMsg = buildCanonicalMessage(sensorCode, Number(pm10), Number(pm25), timestamp);
  const expectedSig = crypto
    .createHmac('sha256', device.secret_reference)
    .update(canonicalMsg)
    .digest('hex')
    .toLowerCase();

  const isSigValid = timingSafeEqual(expectedSig, String(signature).trim().toLowerCase());
  if (!isSigValid) {
    res.status(403).json({
      success: false,
      error: { code: 'INVALID_SIGNATURE', message: 'Chữ ký HMAC không khớp với khóa bảo mật của thiết bị' },
    });
    return;
  }

  // 2. Check Clock Drift (<= 5 minutes)
  const incomingTime = new Date(timestamp).getTime();
  if (isNaN(incomingTime)) {
    res.status(400).json({
      success: false,
      error: { code: 'INVALID_TIMESTAMP', message: 'Dấu thời gian ISO không hợp lệ' },
    });
    return;
  }

  const driftMs = Math.abs(Date.now() - incomingTime);
  if (driftMs > 5 * 60 * 1000) {
    res.status(400).json({
      success: false,
      error: { code: 'CLOCK_DRIFT', message: 'Đồng hồ thiết bị lệch quá 5 phút so với máy chủ' },
    });
    return;
  }

  // 3. Replay Attack Protection
  if (device.last_seen_at) {
    const lastSeenTime = new Date(device.last_seen_at).getTime();
    if (incomingTime <= lastSeenTime) {
      res.status(409).json({
        success: false,
        error: { code: 'REPLAY_DETECTED', message: 'Phát hiện gói tin trùng lặp thời gian hoặc tấn công phát lại' },
      });
      return;
    }
  }

  // 4. Physical Boundaries (Impossible Value Guard)
  const numPm10 = Number(pm10);
  const numPm25 = Number(pm25);
  let integrityStatus = 'VALID';

  if (numPm10 < 0 || numPm10 > 2500 || numPm25 < 0 || numPm25 > 2500) {
    integrityStatus = 'CORRUPTED';
  }

  // 5. Flatline Detection (5 consecutive identical readings)
  const recentReadings = query<any>(
    `SELECT pm10, pm25 FROM iot_readings WHERE device_id = ? ORDER BY recorded_at DESC LIMIT 4`,
    [device.id]
  );

  let isFlatline = false;
  if (recentReadings.length === 4) {
    const allIdentical = recentReadings.every(
      r => Math.abs(r.pm10 - numPm10) < 0.01 && Math.abs(r.pm25 - numPm25) < 0.01
    );
    if (allIdentical) {
      isFlatline = true;
      integrityStatus = 'FLATLINE';
    }
  }

  const readingId = `read-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

  transaction(() => {
    // Insert reading
    run(
      `INSERT INTO iot_readings (id, device_id, recorded_at, received_at, pm25, pm10, temperature, humidity, raw_payload_json, integrity_status, created_at)
       VALUES (?, ?, ?, datetime('now'), ?, ?, ?, ?, ?, ?, datetime('now'))`,
      [
        readingId,
        device.id,
        timestamp,
        numPm25,
        numPm10,
        temperature || null,
        humidity || null,
        JSON.stringify(req.body),
        integrityStatus,
      ]
    );

    // Update device status & last_seen_at
    if (isFlatline) {
      run(
        `UPDATE iot_devices SET status = 'FAULTY', last_seen_at = ?, updated_at = datetime('now') WHERE id = ?`,
        [timestamp, device.id]
      );

      run(
        `INSERT INTO iot_events (id, device_id, event_type, severity, description, created_at)
         VALUES (?, ?, 'FLATLINE', 'HIGH', 'Phát hiện cảm biến treo số 5 bản tin liên tiếp cùng giá trị PM10 & PM2.5', datetime('now'))`,
        [`ev-${Date.now()}`, device.id]
      );

      dispatchAutomationEvent('IOT_DEVICE_OFFLINE', 'IOT_DEVICE', device.id, {
        device_code: device.device_code,
        status: 'FAULTY',
        reason: 'FLATLINE',
      });
    } else {
      run(
        `UPDATE iot_devices SET status = 'ONLINE', last_seen_at = ?, updated_at = datetime('now') WHERE id = ?`,
        [timestamp, device.id]
      );
    }

    // Spike detection -> Create Signal if PM2.5 > 100 or PM10 > 200
    if (numPm25 > 100 || numPm10 > 200) {
      const sigId = `sig-iot-${Date.now()}`;
      run(
        `INSERT INTO signals (id, source_type, external_source_id, signal_type, title, description, location_text, latitude, longitude, observed_at, received_at, integrity_status, created_at)
         VALUES (?, 'IOT', ?, 'PM25_SPIKE', ?, ?, ?, ?, ?, ?, datetime('now'), 'VALID', datetime('now'))`,
        [
          sigId,
          device.device_code,
          `Cảnh báo bụi vượt ngưỡng tại trạm ${device.name}`,
          `Nồng độ PM2.5 đo được: ${numPm25} µg/m³, PM10: ${numPm10} µg/m³ vượt giới hạn QCVN 05:2023`,
          device.location_text,
          device.latitude,
          device.longitude,
          timestamp,
        ]
      );

      dispatchAutomationEvent('IOT_SIGNAL_CREATED', 'SIGNAL', sigId, {
        device_code: device.device_code,
        pm25: numPm25,
        pm10: numPm10,
      });
    }
  });

  res.status(201).json({
    success: true,
    data: {
      recorded: true,
      reading_id: readingId,
      device_code: sensorCode,
      integrity_status: integrityStatus,
      is_flatline: isFlatline,
    },
  });
});
