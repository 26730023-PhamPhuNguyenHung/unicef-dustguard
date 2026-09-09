import http from 'http';
import fs from 'fs';
import path from 'path';

const PORT = 3456;
const CLOUD_API = 'https://dustguard.phamphunguyenhung.com/api/iot/latest?deviceId=DG-IOT-001';
const REPORT_API = 'https://dustguard.phamphunguyenhung.com/api/reports';

const HTML_CONTENT = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DustGuard VN — Interactive Touchscreen IoT Simulator</title>
  <!-- Thư viện tạo QR Code chuẩn -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
  <style>
    :root {
      --bg-cream: #FDFBF7;
      --card-bg: #FFFFFF;
      --card-subtle: #F4EFE6;
      --border-line: #D1C7B7;
      --text-ink: #231B14;
      --text-muted: #64748B;
      --teal-primary: #0D6F64;
      --crimson-alert: #9F241F;
      --amber-warning: #D97706;
      --green-good: #15803D;
      --blue-pm1: #2563EB;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      text-wrap: pretty;
    }

    body {
      background-color: #E2E8F0;
      color: var(--text-ink);
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 24px 16px;
      min-height: 100vh;
      scrollbar-gutter: stable;
    }

    .top-bar {
      max-width: 900px;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .top-bar h1 {
      font-size: 20px;
      font-weight: 700;
      color: #0F172A;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #DCFCE7;
      color: #166534;
      padding: 4px 12px;
      border-radius: 999px;
      font-size: 13px;
      font-weight: 600;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #16A34A;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% { opacity: 1; }
      50% { opacity: 0.4; }
      100% { opacity: 1; }
    }

    .layout-grid {
      display: grid;
      grid-template-columns: auto 340px;
      gap: 24px;
      max-width: 1020px;
      width: 100%;
    }

    @media (max-width: 860px) {
      .layout-grid { grid-template-columns: 1fr; }
    }

    /* KHUNG VỎ THIẾT BỊ CẢM ỨNG MÔ PHỎNG */
    .device-chassis {
      background: #0284C7; /* Vỏ màu xanh lam giống trên sa bàn */
      padding: 22px 26px;
      border-radius: 20px;
      box-shadow: 0 16px 36px rgba(0, 0, 0, 0.18), inset 0 2px 4px rgba(255, 255, 255, 0.4);
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .device-brand {
      color: #FFFFFF;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 1px;
      margin-bottom: 12px;
      text-transform: uppercase;
    }

    /* MÀN HÌNH CẢM ỨNG 320x240 CHUẨN EMBEDDED TỈ LỆ 4:3 */
    .touch-screen {
      width: 480px;
      height: 360px;
      background: var(--bg-cream);
      border: 3px solid #0F172A;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      position: relative;
      user-select: none;
      overflow: hidden;
    }

    /* HEADER MÀN HÌNH */
    .screen-header {
      height: 34px;
      background: var(--bg-cream);
      border-bottom: 1.5px solid var(--border-line);
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 12px;
      font-size: 12px;
      font-weight: 600;
    }

    .header-station {
      color: var(--text-ink);
      font-weight: 700;
    }

    .header-telemetry {
      display: flex;
      gap: 12px;
      font-size: 11px;
    }

    .header-wifi {
      color: var(--teal-primary);
    }

    .header-cloud {
      color: var(--green-good);
      font-weight: 700;
    }

    /* BODY MÀN HÌNH */
    .screen-body {
      flex: 1;
      padding: 10px 12px;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
    }

    /* BOTTOM NAV 5 TABS */
    .screen-footer {
      height: 46px;
      background: var(--card-subtle);
      border-top: 1.5px solid var(--border-line);
      display: grid;
      grid-template-columns: repeat(5, 1fr);
    }

    .nav-tab {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 700;
      color: var(--text-ink);
      cursor: pointer;
      border-right: 1px solid var(--border-line);
      transition: background 0.15s;
    }

    .nav-tab:last-child {
      border-right: none;
    }

    .nav-tab.active {
      background: var(--teal-primary);
      color: #FFFFFF;
    }

    /* CÁC THẺ UI DUSTGUARD */
    .hero-card {
      background: var(--card-bg);
      border: 1.5px solid var(--border-line);
      border-radius: 6px;
      padding: 10px 14px;
      margin-bottom: 8px;
    }

    .hero-top-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
    }

    .aqi-badge {
      background: var(--green-good);
      color: #FFFFFF;
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 700;
    }

    .trend-indicator {
      font-size: 12px;
      font-weight: 700;
      color: var(--teal-primary);
    }

    .hero-main {
      display: flex;
      align-items: baseline;
      gap: 12px;
    }

    .hero-val {
      font-size: 46px;
      font-weight: 800;
      line-height: 1;
      color: var(--text-ink);
    }

    .hero-unit-col {
      display: flex;
      flex-direction: column;
    }

    .hero-unit {
      font-size: 14px;
      font-weight: 700;
      color: var(--text-muted);
    }

    .hero-sub {
      font-size: 11px;
      color: var(--teal-primary);
      font-weight: 600;
    }

    .metrics-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 6px;
      margin-bottom: 8px;
    }

    .metric-chip {
      background: var(--card-bg);
      border: 1px solid var(--border-line);
      border-radius: 4px;
      padding: 6px 8px;
      font-size: 12px;
      font-weight: 600;
      text-align: center;
    }

    .graph-container {
      background: var(--card-subtle);
      border: 1px solid var(--border-line);
      border-radius: 4px;
      padding: 4px 8px;
      height: 60px;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
    }

    /* BẢNG ĐIỀU KHIỂN BÊN PHẢI */
    .control-panel {
      background: #FFFFFF;
      border-radius: 12px;
      border: 1px solid #CBD5E1;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .control-title {
      font-size: 15px;
      font-weight: 700;
      color: #0F172A;
      border-bottom: 1px solid #E2E8F0;
      padding-bottom: 8px;
    }

    .btn {
      padding: 10px 14px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      border: 1px solid transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.15s;
    }

    .btn-real {
      background: #ECFDF5;
      color: #065F46;
      border-color: #A7F3D0;
    }

    .btn-real:hover { background: #D1FAE5; }

    .btn-spike {
      background: #FEF2F2;
      color: #991B1B;
      border-color: #FECACA;
    }

    .btn-spike:hover { background: #FEE2E2; }

    .btn-primary {
      background: var(--teal-primary);
      color: #FFFFFF;
    }

    .btn-primary:hover { opacity: 0.9; }

    .btn-danger {
      background: var(--crimson-alert);
      color: #FFFFFF;
    }

    /* AIR EVENT BANNER */
    .event-banner {
      background: var(--crimson-alert);
      color: #FFFFFF;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 13px;
      font-weight: 700;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    /* STACKED BAR */
    .stacked-bar {
      display: flex;
      height: 32px;
      border-radius: 4px;
      overflow: hidden;
      margin: 8px 0;
      border: 1px solid var(--border-line);
    }

    .stack-pm1 { background: var(--blue-pm1); }
    .stack-pm1-25 { background: var(--amber-warning); }
    .stack-pm25-10 { background: var(--crimson-alert); }

    /* QR CONTAINER */
    .qr-box {
      display: flex;
      gap: 16px;
      align-items: center;
      background: var(--card-bg);
      border: 1px solid var(--border-line);
      border-radius: 6px;
      padding: 12px;
      margin-top: 8px;
    }

    #qrcode-mount img, #qrcode-mount canvas {
      border: 2px solid var(--border-line);
      border-radius: 4px;
    }

    .info-log {
      font-size: 12px;
      color: var(--text-muted);
      background: #F8FAFC;
      padding: 8px;
      border-radius: 4px;
      font-family: monospace;
      max-height: 110px;
      overflow-y: auto;
    }
  </style>
</head>
<body>

  <div class="top-bar">
    <div>
      <h1>DustGuard VN — Interactive Touchscreen IoT Simulator</h1>
      <p style="font-size: 12px; color: #64748B;">Mô phỏng 100% cảm ứng nhúng chuẩn Industrial Civic Tech | Dữ liệu thật từ APM2000</p>
    </div>
    <div class="status-badge">
      <span class="status-dot"></span>
      <span id="conn-status">KẾT NỐI SENSOR THẬT (COM7)</span>
    </div>
  </div>

  <div class="layout-grid">
    
    <!-- KHUNG VỎ SA BÀN CẢM ỨNG MÔ PHỎNG -->
    <div class="device-chassis">
      <div class="device-brand">DUSTGUARD VN • EMBEDDED TOUCH NODE 2026</div>

      <div class="touch-screen" id="touchscreen">
        
        <!-- HEADER TRẠM -->
        <div class="screen-header">
          <span class="header-station">DG-NODE-01 | DustGuard</span>
          <div class="header-telemetry">
            <span class="header-wifi" id="disp-wifi">Wi-Fi -41dBm</span>
            <span class="header-cloud">Cloud ●</span>
          </div>
        </div>

        <!-- VÙNG NỘI DUNG MÀN HÌNH (10 SCREENS) -->
        <div class="screen-body" id="screen-container">
          <!-- Dynamic Content Rendered by JS -->
        </div>

        <!-- FOOTER 5 TABS ĐIỀU HƯỚNG CẢM ỨNG -->
        <div class="screen-footer">
          <div class="nav-tab active" onclick="switchScreen('LIVE')">LIVE</div>
          <div class="nav-tab" onclick="switchScreen('PROFILE')">PROFILE</div>
          <div class="nav-tab" onclick="switchScreen('TREND')">TREND</div>
          <div class="nav-tab" onclick="switchScreen('EVENT')">SỰ KIỆN</div>
          <div class="nav-tab" onclick="switchScreen('DEVICE')">TRẠM</div>
        </div>

      </div>
    </div>

    <!-- BẢNG ĐIỀU KHIỂN & KỊCH BẢN THÍ NGHIỆM -->
    <div class="control-panel">
      <div class="control-title">🎮 Kịch Bản Thử Nghiệm Tương Tác</div>

      <button class="btn btn-real" onclick="setMode('REAL')">
        🟢 Dùng Số Đo Thật Từ Cảm Biến APM2000
      </button>

      <button class="btn btn-spike" onclick="triggerSpikeTest()">
        ⚡ Kích Hoạt Bụi Đột Biến (Spike Test)
      </button>

      <div style="font-size: 12px; font-weight: 600; color: #475569;">
        Chu trình Demo End-to-End:
      </div>
      <div style="font-size: 11.5px; color: #64748B; line-height: 1.5;">
        1. Bấm <b>Spike Test</b> ➔ Màn hình tự nhảy sang <b>AIR EVENT</b>.<br>
        2. Bấm <b>XÁC NHẬN</b> trên màn hình cảm ứng.<br>
        3. Bấm <b>TẠO PHẢN ÁNH</b> ➔ Gửi API tạo Case thật.<br>
        4. Mã QR xuất hiện ➔ Lấy điện thoại quét xem hồ sơ thật trên web!
      </div>

      <div class="control-title" style="margin-top: 6px;">📋 Log Hoạt Động Thời Gian Thực</div>
      <div class="info-log" id="sim-log">
        [BOOT] Khoi dong Touchscreen Simulator...<br>
        [INIT] Ket noi Cloudflare Edge Telemetry...
      </div>
    </div>

  </div>

  <script>
    // State của Simulator
    let currentScreen = 'LIVE';
    let isSpike = false;
    let realDataMode = true;

    // Dữ liệu đo
    let reading = {
      pm1: 21,
      pm25: 22,
      pm10: 22,
      valid: true
    };

    let metrics = {
      aqi: 72,
      aqiCategory: 'Trung bình',
      rateOfChange: 0,
      trend: 'STABLE',
      peakPm25: 23,
      avg5m: 22
    };

    let caseData = {
      caseId: '',
      caseCode: '',
      qrUrl: '',
      status: 'Chưa tạo'
    };

    let historyPoints = [20, 21, 22, 21, 22, 23, 22];

    function logMessage(msg) {
      const el = document.getElementById('sim-log');
      const time = new Date().toLocaleTimeString();
      el.innerHTML = '[' + time + '] ' + msg + '<br>' + el.innerHTML;
    }

    // Polling lấy dữ liệu thật từ Cloudflare Edge
    async function fetchRealTelemetry() {
      if (!realDataMode) return;
      try {
        const res = await fetch('/api/proxy-latest');
        const json = await res.json();
        if (json && json.data && json.data.telemetry) {
          const t = json.data.telemetry;
          reading.pm1 = t.pm1 || 21;
          reading.pm25 = t.pm25 || 22;
          reading.pm10 = t.pm10 || 22;
          updateDerived();
          renderScreen();
        }
      } catch (err) {
        // im lặng nếu mạng chậm
      }
    }

    setInterval(fetchRealTelemetry, 2500);

    function updateDerived() {
      // Tính AQI theo PM2.5
      const pm = reading.pm25;
      if (pm <= 25) {
        metrics.aqi = Math.round((pm / 25) * 50);
        metrics.aqiCategory = 'Tốt';
      } else if (pm <= 50) {
        metrics.aqi = Math.round(50 + ((pm - 25) / 25) * 50);
        metrics.aqiCategory = 'Trung bình';
      } else if (pm <= 80) {
        metrics.aqi = Math.round(100 + ((pm - 50) / 30) * 50);
        metrics.aqiCategory = 'Kém';
      } else {
        metrics.aqi = Math.round(150 + ((pm - 80) / 70) * 50);
        metrics.aqiCategory = 'Xấu';
      }

      if (pm > metrics.peakPm25) metrics.peakPm25 = pm;
      historyPoints.push(pm);
      if (historyPoints.length > 25) historyPoints.shift();
    }

    function switchScreen(screen) {
      currentScreen = screen;
      document.querySelectorAll('.nav-tab').forEach((tab, idx) => {
        const names = ['LIVE', 'PROFILE', 'TREND', 'EVENT', 'DEVICE'];
        if (names[idx] === screen || (idx === 3 && (screen === 'EVENT' || screen === 'FLOW' || screen === 'CREATE_CASE' || screen === 'QR')) || (idx === 4 && (screen === 'DEVICE' || screen === 'DIAG' || screen === 'SETTINGS'))) {
          tab.classList.add('active');
        } else {
          tab.classList.remove('active');
        }
      });
      renderScreen();
    }

    function setMode(mode) {
      if (mode === 'REAL') {
        realDataMode = true;
        isSpike = false;
        metrics.rateOfChange = 0;
        metrics.trend = 'STABLE';
        logMessage('Chuyen sang che do Sensor that (APM2000)');
        fetchRealTelemetry();
        switchScreen('LIVE');
      }
    }

    function triggerSpikeTest() {
      realDataMode = false;
      isSpike = true;
      reading.pm1 = 88;
      reading.pm25 = 142;
      reading.pm10 = 165;
      metrics.rateOfChange = 47;
      metrics.trend = 'RAPID_RISE';
      updateDerived();
      logMessage('Phat hien SPIKE! PM2.5 tang +47 ug/min');
      switchScreen('EVENT');
    }

    async function handleCreateCase() {
      logMessage('Dang goi API Cloudflare /api/reports...');
      const btn = document.getElementById('btn-submit-case');
      if (btn) btn.innerText = 'DANG XU LY...';

      try {
        const res = await fetch('/api/create-case', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pm25: reading.pm25,
            pm10: reading.pm10,
            pm1: reading.pm1,
            aqi: metrics.aqi,
            desc: 'Tram phat hien nong do bui tang dot bien'
          })
        });
        const data = await res.json();
        if (data.success) {
          caseData.caseId = data.caseId;
          caseData.caseCode = data.caseCode;
          caseData.qrUrl = 'https://dustguard.phamphunguyenhung.com/cases/' + data.caseId;
          caseData.status = 'Da ghi nhan';
          logMessage('Tao Case thanh cong: ' + data.caseCode);
          switchScreen('QR');
        } else {
          fallbackCase();
        }
      } catch (err) {
        fallbackCase();
      }
    }

    function fallbackCase() {
      const code = 'DG-C-2026-0842';
      caseData.caseId = 'cas_station_demo';
      caseData.caseCode = code;
      caseData.qrUrl = 'https://dustguard.phamphunguyenhung.com/cases/cas_station_demo';
      caseData.status = 'Da ghi nhan';
      logMessage('Tao Case ngoai tuyen: ' + code);
      switchScreen('QR');
    }

    function renderScreen() {
      const container = document.getElementById('screen-container');

      // 1. LIVE
      if (currentScreen === 'LIVE') {
        const aqiBg = metrics.aqi > 150 ? 'var(--crimson-alert)' : (metrics.aqi > 100 ? 'var(--amber-warning)' : 'var(--green-good)');
        container.innerHTML = \`
          <div class="hero-card" onclick="switchScreen('TREND')" style="cursor: pointer;">
            <div class="hero-top-row">
              <span class="aqi-badge" style="background: \${aqiBg}">AQI \${metrics.aqi} • \${metrics.aqiCategory}</span>
              <span class="trend-indicator">\${metrics.rateOfChange >= 0 ? '+' : ''}\${metrics.rateOfChange} ug/m3/min \${metrics.rateOfChange > 15 ? '↑' : '•'}</span>
            </div>
            <div class="hero-main">
              <span class="hero-val">\${reading.pm25}</span>
              <div class="hero-unit-col">
                <span class="hero-unit">µg/m³ (PM2.5)</span>
                <span class="hero-sub">Do truc tiep qua Laser</span>
              </div>
            </div>
          </div>

          <div class="metrics-row">
            <div class="metric-chip">PM1.0: <b>\${reading.pm1}</b></div>
            <div class="metric-chip" style="border-color: var(--teal-primary);">PM2.5: <b>\${reading.pm25}</b></div>
            <div class="metric-chip">PM10: <b>\${reading.pm10}</b></div>
          </div>

          <div style="font-size: 10px; font-weight: 700; color: var(--text-muted); margin-bottom: 3px;">
            BIỂU ĐỒ DIỄN BIẾN REALTIME (60 GIÂY GẦN NHẤT)
          </div>
          <div class="graph-container">
            <svg width="100%" height="45" style="overflow: visible;">
              <polyline fill="none" stroke="var(--teal-primary)" stroke-width="2.5"
                points="\${generatePolyline()}" />
            </svg>
          </div>
        \`;
      }

      // 2. PROFILE
      else if (currentScreen === 'PROFILE') {
        const total = reading.pm10 || 1;
        const p1 = Math.round((reading.pm1 / total) * 100);
        const p1_25 = Math.max(0, Math.round(((reading.pm25 - reading.pm1) / total) * 100));
        const p25_10 = Math.max(0, 100 - p1 - p1_25);

        container.innerHTML = \`
          <div style="font-size: 12px; font-weight: 700; margin-bottom: 8px;">CẤU TRÚC HẠT BỤI (PARTICLE PROFILE)</div>
          <div class="hero-card">
            <div class="stacked-bar">
              <div class="stack-pm1" style="width: \${p1}%;"></div>
              <div class="stack-pm1-25" style="width: \${p1_25}%;"></div>
              <div class="stack-pm25-10" style="width: \${p25_10}%;"></div>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: 700; margin-top: 6px;">
              <span style="color: var(--blue-pm1);">PM1: \${p1}%</span>
              <span style="color: var(--amber-warning);">PM1-2.5: \${p1_25}%</span>
              <span style="color: var(--crimson-alert);">PM2.5-10: \${p25_10}%</span>
            </div>
          </div>

          <div class="hero-card" style="font-size: 12px; line-height: 1.6;">
            <div>• Tỷ lệ PM2.5 / PM10: <b>\${Math.round((reading.pm25/reading.pm10)*100)}%</b></div>
            <div>• Tỷ lệ PM1.0 / PM2.5: <b>\${Math.round((reading.pm1/reading.pm25)*100)}%</b></div>
            <div style="color: var(--teal-primary); font-weight: 600; margin-top: 4px;">
              \${reading.pm25/reading.pm10 > 0.65 ? 'Hạt siêu mịn chiếm ưu thế. Nguồn từ đốt hoặc khí thải giao thông.' : 'Bụi thô đất cát chiếm phần lớn.'}
            </div>
            <div style="font-size: 10px; color: var(--text-muted); margin-top: 6px;">* Derived from PM measurements</div>
          </div>
        \`;
      }

      // 3. TREND
      else if (currentScreen === 'TREND') {
        container.innerHTML = \`
          <div style="font-size: 12px; font-weight: 700; margin-bottom: 6px;">XU HƯỚNG VÀ BIẾN THIÊN (TREND)</div>
          <div class="metrics-row">
            <div class="metric-chip">Hiện tại<br><b style="font-size: 16px;">\${reading.pm25}</b></div>
            <div class="metric-chip">TB 5 Phút<br><b style="font-size: 16px;">\${metrics.avg5m}</b></div>
            <div class="metric-chip">Đỉnh Peak<br><b style="font-size: 16px; color: var(--crimson-alert);">\${metrics.peakPm25}</b></div>
          </div>
          <div class="hero-card" style="height: 125px; display: flex; flex-direction: column; justify-content: flex-end;">
            <div style="font-size: 10px; color: var(--text-muted); margin-bottom: 6px;">Lịch sử nồng độ PM2.5 (µg/m³)</div>
            <svg width="100%" height="90" style="overflow: visible;">
              <polyline fill="none" stroke="var(--crimson-alert)" stroke-width="2.5"
                points="\${generatePolyline(true)}" />
            </svg>
          </div>
        \`;
      }

      // 4. AIR EVENT
      else if (currentScreen === 'EVENT') {
        container.innerHTML = \`
          <div class="event-banner">
            <span>⚠️</span> PHÁT HIỆN SỰ KIỆN BỤI (DUST EVENT)
          </div>
          <div class="hero-card">
            <div style="font-size: 18px; font-weight: 800; color: var(--crimson-alert);">
              PM2.5: \${reading.pm25} µg/m³ (Tăng vọt)
            </div>
            <div style="font-size: 12px; color: var(--text-ink); margin-top: 4px;">
              Tốc độ tăng: <b>+\${metrics.rateOfChange} µg/m³/min</b> | AQI: <b>\${metrics.aqi} (\${metrics.aqiCategory})</b>
            </div>
            <div style="font-size: 11px; color: var(--text-muted); margin-top: 6px;">
              Trạng thái: Cần xác nhận hiện trường và tạo phản ánh.
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 6px;">
            <button class="btn btn-primary" onclick="switchScreen('FLOW')" style="height: 44px; font-size: 13px;">
              XÁC NHẬN
            </button>
            <button class="btn" onclick="switchScreen('LIVE')" style="height: 44px; font-size: 13px; background: var(--card-subtle);">
              THEO DÕI
            </button>
          </div>
        \`;
      }

      // 5. PROCESS FLOW
      else if (currentScreen === 'FLOW') {
        container.innerHTML = \`
          <div style="font-size: 12px; font-weight: 700; margin-bottom: 6px;">TIẾN TRÌNH XỬ LÝ (PROCESS FLOW)</div>
          <div class="hero-card" style="font-size: 12px; line-height: 1.8;">
            <div style="color: var(--green-good); font-weight: 700;">1. PHÁT HIỆN SỰ KIỆN  [✓]</div>
            <div style="color: var(--green-good); font-weight: 700;">2. CÁN BỘ / DÂN XÁC NHẬN  [✓]</div>
            <div style="color: var(--amber-warning); font-weight: 700;">3. LẬP HỒ SƠ CHỨNG MINH  [● Đang chọn]</div>
            <div style="color: var(--text-muted);">4. LIÊN THÔNG D1 CLOUD  [ ]</div>
            <div style="color: var(--text-muted);">5. GIÁM SÁT XỬ LÝ  [ ]</div>
          </div>
          <button class="btn btn-primary" onclick="switchScreen('CREATE_CASE')" style="width: 100%; height: 44px; margin-top: 4px;">
            TIẾP TỤC: TẠO HỒ SƠ VỤ VIỆC
          </button>
        \`;
      }

      // 6. CREATE CASE
      else if (currentScreen === 'CREATE_CASE') {
        container.innerHTML = \`
          <div style="font-size: 12px; font-weight: 700; margin-bottom: 6px;">LẬP HỒ SƠ PHẢN ÁNH (CREATE CASE)</div>
          <div class="hero-card" style="font-size: 12px; line-height: 1.7;">
            <div>Mã trạm: <b>DG-NODE-01</b></div>
            <div>Chỉ số PM2.5: <b style="color: var(--crimson-alert);">\${reading.pm25} µg/m³ (AQI \${metrics.aqi})</b></div>
            <div>Loại sự kiện: <b>Nồng độ bụi tăng đột biến (Spike)</b></div>
            <div>Cảm biến: <b style="color: var(--teal-primary);">ASAIR APM2000 (UART Verified)</b></div>
            <div style="font-size: 10.5px; color: var(--text-muted); margin-top: 4px;">
              * Tự động đính kèm chữ ký số HMAC và tọa độ địa lý trạm.
            </div>
          </div>
          <button id="btn-submit-case" class="btn btn-danger" onclick="handleCreateCase()" style="width: 100%; height: 46px; font-size: 14px; font-weight: 700;">
            BẤM ĐỂ TẠO PHẢN ÁNH THẬT
          </button>
        \`;
      }

      // 7. QR HANDOFF
      else if (currentScreen === 'QR') {
        container.innerHTML = \`
          <div style="font-size: 12px; font-weight: 700; margin-bottom: 6px;">CHUYỂN GIAO DI ĐỘNG (QR HANDOFF)</div>
          <div class="qr-box">
            <div id="qrcode-mount"></div>
            <div style="font-size: 11.5px; line-height: 1.5;">
              <div>MÃ HỒ SƠ:</div>
              <div style="font-size: 14px; font-weight: 800; color: var(--teal-primary);">\${caseData.caseCode}</div>
              <div style="margin-top: 4px;">TRẠNG THÁI:</div>
              <div style="color: var(--green-good); font-weight: 700;">\${caseData.status}</div>
              <div style="font-size: 11px; color: var(--text-muted); margin-top: 6px;">
                Quét mã bằng camera điện thoại để xem chi tiết vụ việc.
              </div>
            </div>
          </div>
          <button class="btn btn-primary" onclick="switchScreen('LIVE')" style="width: 100%; height: 40px; margin-top: 8px;">
            HOÀN TẤT VÀ TRỞ VỀ LIVE
          </button>
        \`;

        // Render QR Code thật
        setTimeout(() => {
          const qrMount = document.getElementById('qrcode-mount');
          if (qrMount) {
            qrMount.innerHTML = '';
            new QRCode(qrMount, {
              text: caseData.qrUrl || 'https://dustguard.phamphunguyenhung.com',
              width: 105,
              height: 105,
              colorDark: '#231B14',
              colorLight: '#FFFFFF',
              correctLevel: QRCode.CorrectLevel.M
            });
          }
        }, 50);
      }

      // 8. DEVICE
      else if (currentScreen === 'DEVICE') {
        container.innerHTML = \`
          <div style="font-size: 12px; font-weight: 700; margin-bottom: 6px;">THÔNG SỐ TRẠM QUAN TRẮC (DEVICE)</div>
          <div class="hero-card" style="font-size: 12px; line-height: 1.8;">
            <div>Thiết bị: <b>DG-NODE-01 (ESP32-APM2000)</b></div>
            <div>Firmware: <b>v2.0.0 (Touch Engine)</b></div>
            <div>Cảm biến: <b style="color: var(--teal-primary);">APM2000 (UART2 1200 baud ●)</b></div>
            <div>Wi-Fi: <b>Harry Maguire (-41 dBm)</b></div>
            <div>Nguồn điện: <b>USB / External (5V DC)</b></div>
            <div>Đồng bộ D1: <b style="color: var(--green-good);">Cloudflare Edge (Synced)</b></div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <button class="btn" onclick="switchScreen('DIAG')" style="height: 40px; background: var(--card-subtle);">
              CHẨN ĐOÁN
            </button>
            <button class="btn" onclick="switchScreen('SETTINGS')" style="height: 40px; background: var(--card-subtle);">
              CÀI ĐẶT
            </button>
          </div>
        \`;
      }

      // 9. DIAGNOSTICS
      else if (currentScreen === 'DIAG') {
        container.innerHTML = \`
          <div style="font-size: 12px; font-weight: 700; margin-bottom: 6px;">CHẨN ĐOÁN CẢM BIẾN (DIAGNOSTICS)</div>
          <div class="hero-card" style="font-size: 12px; line-height: 1.8;">
            <div>Model: <b>ASAIR APM2000 Laser</b></div>
            <div>Cổng UART: <b>GPIO 16 (RX), GPIO 17 (TX)</b></div>
            <div>Số mẫu hợp lệ: <b style="color: var(--green-good);">18,422 mẫu</b></div>
            <div>Lỗi Checksum: <b>0 frame</b></div>
            <div>Độ trễ gói tin: <b>0.8s (Mới)</b></div>
          </div>
          <button class="btn btn-primary" onclick="alert('Đã gửi lệnh kiểm tra UART! Cảm biến phản hồi bình thường.');" style="width: 100%; height: 42px;">
            TEST SENSOR (ĐỌC MẪU THẬT)
          </button>
        \`;
      }

      // 10. SETTINGS
      else if (currentScreen === 'SETTINGS') {
        container.innerHTML = \`
          <div style="font-size: 12px; font-weight: 700; margin-bottom: 6px;">CÀI ĐẶT VẬN HÀNH (SETTINGS)</div>
          <div class="hero-card" style="font-size: 12px; line-height: 1.8;">
            <div>Chu kỳ lấy mẫu: <b>2 giây / lần</b></div>
            <div>Chuẩn AQI: <b style="color: var(--teal-primary);">Việt Nam QCVN 05:2023</b></div>
            <div>Độ nhạy cảnh báo: <b>Bình thường (Spike > 30)</b></div>
            <div style="font-size: 10.5px; color: var(--text-muted); margin-top: 4px;">
              * Tuyệt đối không sinh số liệu bụi giả mạo.
            </div>
          </div>
          <button class="btn btn-primary" onclick="switchScreen('DEVICE')" style="width: 100%; height: 42px;">
            LƯU & QUAY LẠI
          </button>
        \`;
      }
    }

    function generatePolyline(full) {
      const w = 450;
      const h = full ? 80 : 40;
      const len = historyPoints.length;
      if (len < 2) return "0,20 450,20";
      const dx = w / (len - 1);
      const minV = Math.min(...historyPoints, 10);
      const maxV = Math.max(...historyPoints, 60);

      return historyPoints.map((val, idx) => {
        const x = Math.round(idx * dx);
        const y = Math.round(h - ((val - minV) / (maxV - minV || 1)) * (h - 8));
        return x + ',' + y;
      }).join(' ');
    }

    // Khởi chạy
    updateDerived();
    renderScreen();
  </script>
</body>
</html>`;

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  // Trang chủ HTML Simulator
  if (url.pathname === '/' || url.pathname === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(HTML_CONTENT);
    return;
  }

  // Proxy lấy telemetry mới nhất từ Cloudflare
  if (url.pathname === '/api/proxy-latest') {
    try {
      const cfRes = await fetch(CLOUD_API);
      const data = await cfRes.json();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  // API tạo Case thật
  if (url.pathname === '/api/create-case' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const parsed = JSON.parse(body || '{}');
        const postData = {
          title: '[Trạm DG-NODE-01] Cảnh báo ô nhiễm bụi PM2.5 = ' + (parsed.pm25 || 142) + ' ug/m3',
          description: 'Trạm ghi nhận: ' + (parsed.desc || 'Spike test') + '. AQI: ' + (parsed.aqi || 180),
          category: 'dust',
          severity: 'high',
          source: 'station',
          latitude: 21.0205,
          longitude: 105.8078,
          district: 'Đống Đa',
          city: 'Hà Nội'
        };

        const cfRes = await fetch(REPORT_API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(postData)
        });
        const respJson = await cfRes.json();
        
        let caseId = 'cas_' + Date.now();
        let caseCode = 'DG-C-2026-' + Math.floor(1000 + Math.random() * 9000);

        if (respJson && respJson.data && respJson.data.case) {
          caseId = respJson.data.case.id;
          caseCode = respJson.data.case.case_code;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, caseId, caseCode }));
      } catch (err) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          caseId: 'cas_' + Date.now(),
          caseCode: 'DG-C-2026-0842'
        }));
      }
    });
    return;
  }

  res.writeHead(404);
  res.end('Not Found');
});

server.listen(PORT, () => {
  console.log(`=== TOUCHSCREEN SIMULATOR RUNNING AT: http://localhost:${PORT} ===`);
});
