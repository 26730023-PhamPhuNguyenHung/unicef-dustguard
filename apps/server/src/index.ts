import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { runMigrations } from './db/migrate.js';

import authRoutes from './routes/auth.routes.js';
import reportsRoutes from './routes/reports.routes.js';
import casesRoutes from './routes/cases.routes.js';
import communitiesRoutes from './routes/communities.routes.js';
import tasksRoutes from './routes/tasks.routes.js';
import notificationsRoutes from './routes/notifications.routes.js';
import meRoutes from './routes/me.routes.js';
import moderatorRoutes from './routes/moderator.routes.js';
import adminRoutes from './routes/admin.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Đảm bảo migration đã chạy khi boot
runMigrations();

// Cấu hình uploads directory
const rootUploadsDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(rootUploadsDir)) {
  fs.mkdirSync(rootUploadsDir, { recursive: true });
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
app.use('/uploads', express.static(rootUploadsDir));

// Mount REST API routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/cases', casesRoutes);
app.use('/api/communities', communitiesRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/me', meRoutes);
app.use('/api/moderator', moderatorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Root health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      service: 'DustGuard Community REST API',
      timestamp: new Date().toISOString()
    }
  });
});

// Error handling middleware toàn cục
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('API Error:', err);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: err.message || 'Đã xảy ra lỗi hệ thống.'
    }
  });
});

if (process.env.NODE_ENV !== 'test' && !process.env.NODE_TEST_CONTEXT) {
  app.listen(PORT, () => {
    console.log(`🚀 DustGuard Community Backend đang chạy tại http://localhost:${PORT}`);
  });
}

export default app;
