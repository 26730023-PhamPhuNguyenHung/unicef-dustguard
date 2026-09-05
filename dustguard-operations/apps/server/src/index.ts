import express from 'express';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

import { authMiddleware } from './middleware/auth.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authRouter } from './modules/auth/auth.router.js';
import { dashboardRouter } from './modules/dashboard/dashboard.router.js';
import { casesRouter } from './modules/cases/cases.router.js';
import { legalRouter } from './modules/legal/legal.router.js';
import { inspectionsRouter, templatesRouter } from './modules/inspections/inspections.router.js';
import { findingsRouter } from './modules/findings/findings.router.js';
import { actionsRouter } from './modules/actions/actions.router.js';
import { closuresRouter } from './modules/closures/closures.router.js';
import { evidenceRouter } from './modules/evidence/evidence.router.js';
import { notificationsRouter } from './modules/notifications/notifications.router.js';
import { integrationsRouter } from './modules/integrations/integrations.router.js';
import { adminRouter } from './modules/admin/admin.router.js';
import { signalsRouter } from './modules/signals/signals.router.js';
import { tasksRouter } from './modules/tasks/tasks.router.js';
import { iotRouter } from './modules/iot/iot.router.js';
import { automationsRouter } from './modules/automations/automations.router.js';
import { reportsRouter } from './modules/reports/reports.router.js';
import { searchRouter } from './modules/search/search.router.js';
import { projectsRouter } from './modules/projects/projects.router.js';
import { contractorsRouter } from './modules/contractors/contractors.router.js';
import { decisionSupportRouter } from './modules/decision-support/decisionSupport.router.js';
import { runMigrations } from './db/migrate.js';

// Auto-run schema migrations and statutory configurations on server startup
runMigrations();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '../..');
const UPLOADS_DIR = path.join(PROJECT_ROOT, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

export const app = express();

// Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Static uploads serving with fallback for broken files
app.use('/uploads', express.static(UPLOADS_DIR));

// Automatic auth token extraction
app.use(authMiddleware);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'UP',
    name: 'DustGuard Operations REST API',
    timestamp: new Date().toISOString(),
  });
});

// Mount modular routers
app.use('/api/auth', authRouter);
app.use('/api/dashboard', dashboardRouter);

// Projects & Contractors Registry
app.use('/api/projects', projectsRouter);
app.use('/api/contractors', contractorsRouter);

// Signals & Tasks
app.use('/api/signals', signalsRouter);
app.use('/api/tasks', tasksRouter);

// Cases & Case actions
app.use('/api/cases', casesRouter);
app.use('/api/cases', closuresRouter);
app.use('/api/cases', legalRouter);
app.use('/api/cases', inspectionsRouter);
app.use('/api/cases', actionsRouter);
app.use('/api/cases', evidenceRouter);

// Decision Support Engine (Evidence-Grounded Intelligence)
app.use('/api', decisionSupportRouter);

// Legal Library & Search & Ingestion
app.use('/api/legal', legalRouter);

// IoT Monitoring & Ingestion
app.use('/api/iot', iotRouter);

// Automation Engine
app.use('/api/automations', automationsRouter);

// Inspection templates & Inspection flow
app.use('/api/inspection-templates', templatesRouter);
app.use('/api/inspections', inspectionsRouter);
app.use('/api/inspections', findingsRouter);

// Findings across cases
app.use('/api/findings', findingsRouter);

// Corrective Actions & Remediation
app.use('/api/actions', actionsRouter);
app.use('/api/remediation', actionsRouter);

// Evidence upload
app.use('/api/evidence', evidenceRouter);

// Reports & Unified Search
app.use('/api/reports', reportsRouter);
app.use('/api/search', searchRouter);

// Notifications & Integrations & Admin
app.use('/api/notifications', notificationsRouter);
app.use('/api/integrations', integrationsRouter);
app.use('/api/admin', adminRouter);

// Error Handling (RFC 7807)
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

const isTestEnv =
  process.env.NODE_ENV === 'test' ||
  process.argv.some(arg => arg.includes('test')) ||
  process.execArgv.some(arg => arg.includes('test'));

if (!isTestEnv) {
  app.listen(PORT, () => {
    console.log(`[DustGuard Operations API] Server running on http://localhost:${PORT}`);
  });
}
