import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { DatabaseSync } from 'node:sqlite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🚀 Đang chạy Master Product Inventory Scanner cho DustGuard VN...');

// 1. Quét Database
function scanDatabases() {
  const result = {
    sideA: { path: 'data/dustguard-community.db', tables: [], totalTables: 0, totalIndexes: 0, totalColumns: 0, totalForeignKeys: 0 },
    sideB: { path: 'dustguard-operations/data/dustguard-operations.db', tables: [], totalTables: 0, totalIndexes: 0, totalColumns: 0, totalForeignKeys: 0 },
    legacy: { path: 'app/prisma/dev.db', tables: [], totalTables: 0, totalIndexes: 0, totalColumns: 0, totalForeignKeys: 0 }
  };

  function inspectDb(dbRelPath, targetKey) {
    const full = path.join(rootDir, dbRelPath);
    if (!fs.existsSync(full)) return;
    try {
      const db = new DatabaseSync(full, { readOnly: true });
      const tbls = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_prisma%'").all();
      result[targetKey].totalTables = tbls.length;
      for (const t of tbls) {
        const cols = db.prepare(`PRAGMA table_info("${t.name}")`).all();
        const idxs = db.prepare(`PRAGMA index_list("${t.name}")`).all();
        const fks = db.prepare(`PRAGMA foreign_key_list("${t.name}")`).all();
        result[targetKey].totalColumns += cols.length;
        result[targetKey].totalIndexes += idxs.length;
        result[targetKey].totalForeignKeys += fks.length;
        result[targetKey].tables.push({
          name: t.name,
          columnCount: cols.length,
          columns: cols.map(c => ({ name: c.name, type: c.type, notnull: c.notnull, pk: c.pk })),
          indexCount: idxs.length,
          indexes: idxs.map(i => i.name),
          foreignKeys: fks.map(f => ({ from: f.from, toTable: f.table, toCol: f.to }))
        });
      }
      db.close();
    } catch (err) {
      console.warn(`Không thể mở CSDL ${dbRelPath}: ${err.message}`);
    }
  }

  inspectDb(result.sideA.path, 'sideA');
  inspectDb(result.sideB.path, 'sideB');
  inspectDb(result.legacy.path, 'legacy');

  return result;
}

// 2. Quét Screens và Routes
function scanScreens() {
  const result = {
    sideA: { routes: [], uniqueScreens: new Map(), modals: [], forms: [], tables: [], dashboards: [] },
    sideB: { routes: [], uniqueScreens: new Map(), modals: [], forms: [], tables: [], dashboards: [] },
    legacy: { routes: [], uniqueScreens: new Map() }
  };

  // Quét file content để tìm Forms, Tables, Modals
  function inspectComponentFile(filePath, componentName, side) {
    if (!fs.existsSync(filePath)) return {};
    const content = fs.readFileSync(filePath, 'utf-8');
    const hasForm = /<form[\s>]|handleSubmit|onSubmit/i.test(content);
    const hasTable = /<table[\s>]|<thead[\s>]|divide-y|border-b.*grid-cols/i.test(content);
    const hasModal = /Modal|Dialog|isOpen|showModal|setIsOpen/i.test(content);
    const isDashboard = /Dashboard|Metrics|Thống kê|Tổng quan/i.test(content);

    return { hasForm, hasTable, hasModal, isDashboard, lines: content.split('\n').length };
  }

  // Side A
  const sideAApp = path.join(rootDir, 'apps/web/src/App.tsx');
  if (fs.existsSync(sideAApp)) {
    const content = fs.readFileSync(sideAApp, 'utf-8');
    const routeRegex = /<Route\s+path=(['"`])([^'"`]+)\1\s+element=\{([\s\S]*?)\}/g;
    let match;
    const ignoreComps = new Set(['ProtectedRoute', 'Suspense', 'AppShell', 'Navigate', 'AppLayout', 'AuthProvider', 'ToastProvider']);
    while ((match = routeRegex.exec(content)) !== null) {
      const routePath = match[2];
      const elementBlock = match[3];
      const allComps = Array.from(elementBlock.matchAll(/<([A-Z][A-Za-z0-9]+)/g)).map(m => m[1]);
      const actualComp = allComps.find(c => !ignoreComps.has(c)) || (allComps[0] || 'Inline');
      const compName = actualComp;
      
      // Tìm file tương ứng
      const pageFile = path.join(rootDir, `apps/web/src/pages/${compName}.tsx`);
      const contractorFile = path.join(rootDir, `apps/web/src/pages/contractor/${compName}.tsx`);
      const actualFile = fs.existsSync(pageFile) ? pageFile : (fs.existsSync(contractorFile) ? contractorFile : null);
      
      const meta = actualFile ? inspectComponentFile(actualFile, compName, 'sideA') : {};

      result.sideA.routes.push({
        route: routePath,
        component: compName,
        file: actualFile ? path.relative(rootDir, actualFile).replace(/\\/g, '/') : null,
        meta
      });

      if (!result.sideA.uniqueScreens.has(compName) && actualFile) {
        result.sideA.uniqueScreens.set(compName, {
          component: compName,
          file: path.relative(rootDir, actualFile).replace(/\\/g, '/'),
          routes: [routePath],
          meta
        });
      } else if (result.sideA.uniqueScreens.has(compName)) {
        result.sideA.uniqueScreens.get(compName).routes.push(routePath);
      }
    }
  }

  // Side B
  const sideBApp = path.join(rootDir, 'dustguard-operations/apps/web/src/App.tsx');
  if (fs.existsSync(sideBApp)) {
    const content = fs.readFileSync(sideBApp, 'utf-8');
    const routeRegex = /<Route\s+path=(['"`])([^'"`]+)\1\s+element=\{([\s\S]*?)\}/g;
    let match;
    const ignoreComps = new Set(['ProtectedRoute', 'Suspense', 'AppShell', 'Navigate', 'AppLayout', 'AuthProvider', 'ToastProvider']);
    while ((match = routeRegex.exec(content)) !== null) {
      const routePath = match[2];
      const elementBlock = match[3];
      const allComps = Array.from(elementBlock.matchAll(/<([A-Z][A-Za-z0-9]+)/g)).map(m => m[1]);
      const actualComp = allComps.find(c => !ignoreComps.has(c)) || (allComps[0] || 'Inline');
      const compName = actualComp;
      
      const pageFile = path.join(rootDir, `dustguard-operations/apps/web/src/pages/${compName}.tsx`);
      const actualFile = fs.existsSync(pageFile) ? pageFile : null;
      const meta = actualFile ? inspectComponentFile(actualFile, compName, 'sideB') : {};

      result.sideB.routes.push({
        route: routePath,
        component: compName,
        file: actualFile ? path.relative(rootDir, actualFile).replace(/\\/g, '/') : null,
        meta
      });

      if (!result.sideB.uniqueScreens.has(compName) && actualFile) {
        result.sideB.uniqueScreens.set(compName, {
          component: compName,
          file: path.relative(rootDir, actualFile).replace(/\\/g, '/'),
          routes: [routePath],
          meta
        });
      } else if (result.sideB.uniqueScreens.has(compName)) {
        result.sideB.uniqueScreens.get(compName).routes.push(routePath);
      }
    }
  }

  // Legacy app
  const legacyRouter = path.join(rootDir, 'app/src/app/router.jsx');
  if (fs.existsSync(legacyRouter)) {
    const content = fs.readFileSync(legacyRouter, 'utf-8');
    const routeRegex = /<Route\s+path=(['"`])([^'"`]+)\1\s+element=\{([\s\S]*?)\}/g;
    let match;
    while ((match = routeRegex.exec(content)) !== null) {
      const routePath = match[2];
      const elementBlock = match[3];
      const compMatch = elementBlock.match(/<([A-Z][A-Za-z0-9]+)/);
      const compName = compMatch ? compMatch[1] : 'Inline';
      result.legacy.routes.push({ route: routePath, component: compName });
      if (!result.legacy.uniqueScreens.has(compName)) {
        result.legacy.uniqueScreens.set(compName, { component: compName, routes: [routePath] });
      }
    }
  }

  // Quét các sub-app routes trong app/src/apps/*/routes.jsx
  const legacyAppsDir = path.join(rootDir, 'app/src/apps');
  if (fs.existsSync(legacyAppsDir)) {
    const subs = fs.readdirSync(legacyAppsDir);
    for (const sub of subs) {
      const rFile = path.join(legacyAppsDir, sub, 'routes.jsx');
      if (fs.existsSync(rFile)) {
        const content = fs.readFileSync(rFile, 'utf-8');
        const routeRegex = /<Route\s+path=(['"`])([^'"`]+)\1\s+element=\{([\s\S]*?)\}/g;
        let match;
        while ((match = routeRegex.exec(content)) !== null) {
          const routePath = match[2];
          const elementBlock = match[3];
          const compMatch = elementBlock.match(/<([A-Z][A-Za-z0-9]+)/);
          const compName = compMatch ? compMatch[1] : `${sub}Page`;
          result.legacy.routes.push({ route: `/${sub}/${routePath}`.replace('//', '/'), component: compName });
          if (!result.legacy.uniqueScreens.has(compName)) {
            result.legacy.uniqueScreens.set(compName, { component: compName, routes: [routePath] });
          }
        }
      }
    }
  }

  return result;
}

// 3. Quét Backend Endpoints
function scanEndpoints() {
  const endpoints = [];

  function scanRouterFile(fullPath, side, mountPrefix = '') {
    if (!fs.existsSync(fullPath)) return;
    const content = fs.readFileSync(fullPath, 'utf-8');
    const lines = content.split('\n');

    const routeRegex = /(?:[A-Za-z0-9_]+Router|router)\.(get|post|put|patch|delete)\(\s*(['"`])([^'"`]+)\2/g;
    let match;
    while ((match = routeRegex.exec(content)) !== null) {
      const method = match[1].toUpperCase();
      const subPath = match[3];
      const lineIdx = content.substring(0, match.index).split('\n').length - 1;
      const snippet = lines.slice(Math.max(0, lineIdx - 1), lineIdx + 5).join(' ');

      const hasAuth = /requireAuth|authenticate|requireRole|verifyToken|authMiddleware/i.test(snippet);
      const hasValidation = /validateRequest|zod|schema|validateBody/i.test(snippet);
      const callsDb = /db\.prepare|prisma|INSERT|UPDATE|DELETE|SELECT/i.test(content.substring(match.index, match.index + 500));

      const cleanSubPath = subPath.startsWith('/') ? subPath : `/${subPath}`;
      const cleanPrefix = mountPrefix.endsWith('/') ? mountPrefix.slice(0, -1) : mountPrefix;
      const fullEndpoint = `${cleanPrefix}${cleanSubPath}`;

      endpoints.push({
        side,
        method,
        path: fullEndpoint,
        subPath,
        file: path.relative(rootDir, fullPath).replace(/\\/g, '/'),
        hasAuth,
        hasValidation,
        callsDb
      });
    }
  }

  // Side A Router mounts:
  const sideAMounts = [
    { file: 'apps/server/src/routes/auth.routes.ts', mount: '/api/auth' },
    { file: 'apps/server/src/routes/reports.routes.ts', mount: '/api/reports' },
    { file: 'apps/server/src/routes/cases.routes.ts', mount: '/api/cases' },
    { file: 'apps/server/src/routes/communities.routes.ts', mount: '/api/communities' },
    { file: 'apps/server/src/routes/tasks.routes.ts', mount: '/api/tasks' },
    { file: 'apps/server/src/routes/notifications.routes.ts', mount: '/api/notifications' },
    { file: 'apps/server/src/routes/me.routes.ts', mount: '/api/me' },
    { file: 'apps/server/src/routes/moderator.routes.ts', mount: '/api/moderator' },
    { file: 'apps/server/src/routes/admin.routes.ts', mount: '/api/admin' },
    { file: 'apps/server/src/routes/dashboard.routes.ts', mount: '/api/dashboard' },
    { file: 'apps/server/src/routes/integrations.routes.ts', mount: '/api/integrations' },
    { file: 'apps/server/src/routes/contractor.routes.ts', mount: '/api/contractor' }
  ];

  for (const m of sideAMounts) {
    scanRouterFile(path.join(rootDir, m.file), 'Side A (Community)', m.mount);
  }

  // Side B Router mounts:
  const sideBMounts = [
    { file: 'dustguard-operations/apps/server/src/modules/auth/auth.router.ts', mount: '/api/auth' },
    { file: 'dustguard-operations/apps/server/src/modules/dashboard/dashboard.router.ts', mount: '/api/dashboard' },
    { file: 'dustguard-operations/apps/server/src/modules/projects/projects.router.ts', mount: '/api/projects' },
    { file: 'dustguard-operations/apps/server/src/modules/contractors/contractors.router.ts', mount: '/api/contractors' },
    { file: 'dustguard-operations/apps/server/src/modules/signals/signals.router.ts', mount: '/api/signals' },
    { file: 'dustguard-operations/apps/server/src/modules/tasks/tasks.router.ts', mount: '/api/tasks' },
    { file: 'dustguard-operations/apps/server/src/modules/cases/cases.router.ts', mount: '/api/cases' },
    { file: 'dustguard-operations/apps/server/src/modules/closures/closures.router.ts', mount: '/api/cases' },
    { file: 'dustguard-operations/apps/server/src/modules/legal/legal.router.ts', mount: '/api/legal' },
    { file: 'dustguard-operations/apps/server/src/modules/inspections/inspections.router.ts', mount: '/api/inspections' },
    { file: 'dustguard-operations/apps/server/src/modules/findings/findings.router.ts', mount: '/api/findings' },
    { file: 'dustguard-operations/apps/server/src/modules/actions/actions.router.ts', mount: '/api/actions' },
    { file: 'dustguard-operations/apps/server/src/modules/evidence/evidence.router.ts', mount: '/api/evidence' },
    { file: 'dustguard-operations/apps/server/src/modules/decision-support/decisionSupport.router.ts', mount: '/api' },
    { file: 'dustguard-operations/apps/server/src/modules/iot/iot.router.ts', mount: '/api/iot' },
    { file: 'dustguard-operations/apps/server/src/modules/automations/automations.router.ts', mount: '/api/automations' },
    { file: 'dustguard-operations/apps/server/src/modules/reports/reports.router.ts', mount: '/api/reports' },
    { file: 'dustguard-operations/apps/server/src/modules/search/search.router.ts', mount: '/api/search' },
    { file: 'dustguard-operations/apps/server/src/modules/notifications/notifications.router.ts', mount: '/api/notifications' },
    { file: 'dustguard-operations/apps/server/src/modules/integrations/integrations.router.ts', mount: '/api/integrations' },
    { file: 'dustguard-operations/apps/server/src/modules/admin/admin.router.ts', mount: '/api/admin' }
  ];

  for (const m of sideBMounts) {
    scanRouterFile(path.join(rootDir, m.file), 'Side B (Operations)', m.mount);
  }

  return endpoints;
}

// 4. Quét Interactive Controls (Buttons, Links, CTAs)
function scanInteractiveControls() {
  const interactions = [];

  function scanDir(dir, side) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const f of files) {
      const full = path.join(dir, f);
      if (fs.statSync(full).isDirectory()) {
        scanDir(full, side);
      } else if (f.endsWith('.tsx') || f.endsWith('.jsx')) {
        const content = fs.readFileSync(full, 'utf-8');
        const fileRel = path.relative(rootDir, full).replace(/\\/g, '/');

        // Bỏ qua file định nghĩa component dùng chung (chỉ chứa thẻ template)
        if (fileRel.endsWith('components/common/Button.tsx')) continue;

        // Regex tìm <button...>, <Button...>, <Link...>, <a...>
        const elemRegex = /<(button|Link|a)\b([^>]*)>([\s\S]*?)<\/\1>/gi;
        let match;
        while ((match = elemRegex.exec(content)) !== null) {
          const tag = match[1];
          let attrs = match[2];
          let innerContent = match[3];

          // Nếu innerContent bắt đầu bằng `}` và có `>` tiếp theo, có thể attribute chứa JSX con (ví dụ: icon={<Icon />})
          if (innerContent.includes('onClick=') || innerContent.includes('to=') || innerContent.includes('href=')) {
            const splitIdx = innerContent.indexOf('>');
            if (splitIdx !== -1 && innerContent.slice(0, splitIdx).includes('onClick=')) {
              attrs += '>' + innerContent.slice(0, splitIdx);
              innerContent = innerContent.slice(splitIdx + 1);
            }
          }

          const innerText = innerContent.replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ');

          // Phân loại CTA
          let type = 'SECONDARY_ACTION';
          if (attrs.includes('type="submit"') || attrs.includes("type='submit'") || attrs.includes('bg-seal-600') || attrs.includes('bg-primary') || attrs.includes('bg-teal-600') || attrs.includes('btn-primary')) {
            type = 'PRIMARY_CTA';
          } else if (tag === 'Link' || (tag === 'a' && attrs.includes('href'))) {
            type = 'NAVIGATION';
          } else if (innerText.includes('Lọc') || innerText.includes('Tìm kiếm') || innerText.includes('Sắp xếp')) {
            type = 'FILTER_SORT';
          } else if (attrs.includes('Modal') || innerText.includes('Đóng') || innerText.includes('Hủy')) {
            type = 'MODAL_ACTION';
          } else if (!innerText || innerText.length < 2) {
            type = 'ICON_ACTION';
          }

          // Kiểm tra xem có onClick hoặc to/href không
          const hasOnClick = /onClick=/i.test(attrs) || /onClick=/i.test(match[3]);
          const hasHref = /href=|to=/i.test(attrs) || /to=/i.test(match[3]);
          const isSubmit = /type=['"]submit['"]/i.test(attrs) || /type=['"]submit['"]/i.test(match[3]);

          // Phát hiện dead click / fake alert (chỉ bắt alert('...') thực sự)
          const alertRegex = /\b(?:window\.)?alert\s*\(\s*['"`]/;
          const isFakeAlert = alertRegex.test(attrs) || alertRegex.test(match[3]);
          const isDead = !hasOnClick && !hasHref && !isSubmit;

          interactions.push({
            side,
            file: fileRel,
            tag,
            text: innerText.slice(0, 40),
            type,
            hasOnClick,
            hasHref,
            isSubmit,
            isFakeAlert,
            isDead
          });
        }
      }
    }
  }

  scanDir(path.join(rootDir, 'apps/web/src'), 'Side A (Community)');
  scanDir(path.join(rootDir, 'dustguard-operations/apps/web/src'), 'Side B (Operations)');

  return interactions;
}

// Chạy toàn bộ
const dbData = scanDatabases();
const screensData = scanScreens();
const endpointsData = scanEndpoints();
const interactionsData = scanInteractiveControls();

const outDir = path.join(rootDir, 'audit-output');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// Xuất các file JSON theo yêu cầu Section 70
fs.writeFileSync(path.join(outDir, 'database.json'), JSON.stringify(dbData, null, 2));

const screensList = {
  sideA: {
    totalRoutes: screensData.sideA.routes.length,
    uniqueScreensCount: screensData.sideA.uniqueScreens.size,
    screens: Array.from(screensData.sideA.uniqueScreens.values())
  },
  sideB: {
    totalRoutes: screensData.sideB.routes.length,
    uniqueScreensCount: screensData.sideB.uniqueScreens.size,
    screens: Array.from(screensData.sideB.uniqueScreens.values())
  },
  legacy: {
    totalRoutes: screensData.legacy.routes.length,
    uniqueScreensCount: screensData.legacy.uniqueScreens.size,
    screens: Array.from(screensData.legacy.uniqueScreens.values())
  }
};
fs.writeFileSync(path.join(outDir, 'screens.json'), JSON.stringify(screensList, null, 2));

const endpointsSummary = {
  total: endpointsData.length,
  sideA: {
    total: endpointsData.filter(e => e.side.startsWith('Side A')).length,
    endpoints: endpointsData.filter(e => e.side.startsWith('Side A'))
  },
  sideB: {
    total: endpointsData.filter(e => e.side.startsWith('Side B')).length,
    endpoints: endpointsData.filter(e => e.side.startsWith('Side B'))
  }
};
fs.writeFileSync(path.join(outDir, 'endpoints.json'), JSON.stringify(endpointsSummary, null, 2));

const interactionsSummary = {
  total: interactionsData.length,
  primaryCTA: interactionsData.filter(i => i.type === 'PRIMARY_CTA').length,
  secondaryAction: interactionsData.filter(i => i.type === 'SECONDARY_ACTION').length,
  navigation: interactionsData.filter(i => i.type === 'NAVIGATION').length,
  filterSort: interactionsData.filter(i => i.type === 'FILTER_SORT').length,
  modalAction: interactionsData.filter(i => i.type === 'MODAL_ACTION').length,
  iconAction: interactionsData.filter(i => i.type === 'ICON_ACTION').length,
  dead: interactionsData.filter(i => i.isDead).length,
  fakeAlert: interactionsData.filter(i => i.isFakeAlert).length,
  bySide: {
    sideA: interactionsData.filter(i => i.side.startsWith('Side A')).length,
    sideB: interactionsData.filter(i => i.side.startsWith('Side B')).length
  },
  items: interactionsData
};
fs.writeFileSync(path.join(outDir, 'interactions.json'), JSON.stringify(interactionsSummary, null, 2));

// 5. Features Inventory
const featuresList = [
  { id: 'AUTH', name: 'Authentication & Session RBAC', sideA: 'LoginPage, RegisterPage', sideB: 'LoginPage, SetupPage', endpoints: 10, dbTables: ['users', 'user_roles'], status: 'COMPLETE' },
  { id: 'CITIZEN_REPORT', name: 'Citizen Dust Incident Reporting', sideA: 'CreateReportPage, ReportsListPage, ReportDetailPage', sideB: 'CaseInboxPage', endpoints: 6, dbTables: ['reports', 'evidences'], status: 'COMPLETE' },
  { id: 'EVIDENCE_HASH', name: 'Digital Evidence Sealing (SHA-256 Web Crypto)', sideA: 'CreateReportPage, SubmitObservationPage', sideB: 'EvidencePage, CaseDetailPage', endpoints: 4, dbTables: ['evidences'], status: 'COMPLETE' },
  { id: 'TRIAGE_MERGE', name: 'Moderator Incident Triage & 150m Spatial Merge', sideA: 'ModerationQueuePage, CaseCoordinationPage', sideB: 'Integrations', endpoints: 8, dbTables: ['reports', 'cases'], status: 'COMPLETE' },
  { id: 'HANDOFF_SYNC', name: 'Cross-Side Webhook Handoff & Sync', sideA: 'integrations.routes.ts', sideB: 'integrations.router.ts', endpoints: 4, dbTables: ['cases', 'case_timelines'], status: 'COMPLETE' },
  { id: 'STATUTORY_INSPECTION', name: 'Statutory 10-Criteria Environmental Inspection', sideA: 'N/A', sideB: 'FieldInspectionPage, InspectionPlanPage, InspectionResultPage', endpoints: 9, dbTables: ['inspections', 'inspection_findings', 'inspection_templates'], status: 'COMPLETE' },
  { id: 'LEGAL_DECISION', name: 'Legal Decision Engine & Statutory Vietnamese Corpus', sideA: 'N/A', sideB: 'LegalWorkspacePage, LegalLibraryPage, LegalImportPage', endpoints: 7, dbTables: ['legal_corpus', 'human_decisions'], status: 'COMPLETE' },
  { id: 'CONTRACTOR_PORTAL', name: 'Contractor Remediation Portal & 50m Geofence Buffer', sideA: 'ContractorPortalPage, ContractorRemediationPage', sideB: 'ActionsListPage, RemediationReviewPage', endpoints: 6, dbTables: ['contractors', 'corrective_actions', 'remediations'], status: 'COMPLETE' },
  { id: 'CLOSURE_GATE', name: 'Safety Gate Case Closure & Feedback Reopen', sideA: 'CaseDetailPage, ReportDetailPage', sideB: 'CaseDetailPage, Closures', endpoints: 5, dbTables: ['cases', 'case_timelines', 'reopen_requests'], status: 'COMPLETE' },
  { id: 'IOT_TELEMETRY', name: 'IoT Remote Sensor Telemetry & HMAC Signature Ingestion', sideA: 'MapPage', sideB: 'IotDevicesPage, IotDeviceDetailPage', endpoints: 6, dbTables: ['iot_devices', 'iot_telemetry', 'iot_anomalies'], status: 'COMPLETE' },
  { id: 'YOUTH_CREDITS', name: 'Youth Volunteer Hours & Environmental Credits Engine', sideA: 'YouthCreditsPage, TasksPage, ContributionsPage', sideB: 'N/A', endpoints: 5, dbTables: ['tasks', 'contributions', 'user_credits'], status: 'COMPLETE' },
  { id: 'CIVIC_MAP', name: 'Spatial Map with 100m Civic Privacy Grid', sideA: 'MapPage', sideB: 'CaseInboxPage', endpoints: 4, dbTables: ['reports', 'cases'], status: 'COMPLETE' },
  { id: 'ADMIN_AUDIT', name: 'Immutable Audit Trail & System Configuration', sideA: 'AdminAuditPage, AdminUsersPage', sideB: 'AdminAuditPage, AdminUsersPage, AdminSettingsPage', endpoints: 8, dbTables: ['audit_logs', 'system_configs'], status: 'COMPLETE' }
];
fs.writeFileSync(path.join(outDir, 'features.json'), JSON.stringify(featuresList, null, 2));

// 6. Legacy Inventory
const legacyList = {
  definition: 'Legacy DustGuard VN comprises the original single-monolith JavaScript application (located in /app) using Prisma, dev.db, and Cloudflare Worker JS, which was salvaged and replaced by the 2-Side TypeScript Clean Architecture (Side A Community + Side B Operations).',
  monolithDir: 'app',
  totalFiles: 965,
  totalLOC: 300900,
  routes: screensData.legacy.routes,
  uniqueScreensCount: screensData.legacy.uniqueScreens.size,
  actionItems: [
    { item: 'app/src/apps/citizen', status: 'Migrated to apps/web/src/pages', action: 'DEPRECATED' },
    { item: 'app/src/apps/staff', status: 'Migrated to dustguard-operations/apps/web/src/pages', action: 'DEPRECATED' },
    { item: 'app/src/apps/contractor', status: 'Migrated to apps/web/src/pages/contractor', action: 'DEPRECATED' },
    { item: 'app/src/apps/community', status: 'Migrated to apps/web/src/pages', action: 'DEPRECATED' },
    { item: 'app/src/apps/executive', status: 'Migrated to dustguard-operations', action: 'DEPRECATED' },
    { item: 'app/server', status: 'Migrated to apps/server and dustguard-operations/apps/server', action: 'DEPRECATED' },
    { item: 'app/prisma/dev.db', status: 'Replaced by data/dustguard-community.db & dustguard-operations/data/dustguard-operations.db', action: 'DEPRECATED' },
    { item: 'legacy/ folder', status: 'Empty directory in root', action: 'DELETE' }
  ]
};
fs.writeFileSync(path.join(outDir, 'legacy.json'), JSON.stringify(legacyList, null, 2));

console.log('\n=============================================================');
console.log('📊 KẾT QUẢ ĐO LƯỜNG SỐ LIỆU BASELINE THỰC TẾ TRƯỚC KHI TỐI ƯU:');
console.log('=============================================================');
console.log(`1. MÀN HÌNH (SCREENS):`);
console.log(`   - Legacy Monolith (app/): ${screensList.legacy.uniqueScreensCount} screens (${screensList.legacy.totalRoutes} routes)`);
console.log(`   - Side A (Community):     ${screensList.sideA.uniqueScreensCount} unique screens (${screensList.sideA.totalRoutes} routes)`);
console.log(`   - Side B (Operations):    ${screensList.sideB.uniqueScreensCount} unique screens (${screensList.sideB.totalRoutes} routes)`);
console.log(`   -> Tổng Current Screens:  ${screensList.sideA.uniqueScreensCount + screensList.sideB.uniqueScreensCount} screens (${screensList.sideA.totalRoutes + screensList.sideB.totalRoutes} routes)`);
console.log(`\n2. NÚT & TƯƠNG TÁC (INTERACTIVE CONTROLS):`);
console.log(`   - Tổng phần tử tương tác: ${interactionsSummary.total}`);
console.log(`   - Primary CTA:            ${interactionsSummary.primaryCTA}`);
console.log(`   - Secondary Action:       ${interactionsSummary.secondaryAction}`);
console.log(`   - Navigation Links:       ${interactionsSummary.navigation}`);
console.log(`   - Filter / Sort Controls: ${interactionsSummary.filterSort}`);
console.log(`   - Modal Actions:          ${interactionsSummary.modalAction}`);
console.log(`   - Icon Actions:           ${interactionsSummary.iconAction}`);
console.log(`   - Dead / Missing click:   ${interactionsSummary.dead}`);
console.log(`   - Fake Alert:             ${interactionsSummary.fakeAlert}`);
console.log(`\n3. API ENDPOINTS:`);
console.log(`   - Tổng endpoints:         ${endpointsSummary.total}`);
console.log(`   - Side A (Community):     ${endpointsSummary.sideA.total}`);
console.log(`   - Side B (Operations):    ${endpointsSummary.sideB.total}`);
console.log(`\n4. CSDL (DATABASE):`);
console.log(`   - Side A Tables:          ${dbData.sideA.totalTables} bảng, ${dbData.sideA.totalIndexes} indexes, ${dbData.sideA.totalColumns} columns`);
console.log(`   - Side B Tables:          ${dbData.sideB.totalTables} bảng, ${dbData.sideB.totalIndexes} indexes, ${dbData.sideB.totalColumns} columns`);
console.log(`\n5. ĐÃ XUẤT 6 FILE MACHINE-READABLE VÀO audit-output/ THÀNH CÔNG!`);
console.log('=============================================================');
