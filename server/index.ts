import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { BUILD_METADATA } from './version.js';
import { getObject } from './r2.js';
import { createCommunityRouter } from './community.js';
import { createOperationsRouter } from './operations.js';

export function createUnifiedApp() {
  const app = new Hono<{ Bindings: { DB: any; STORAGE: any; EVIDENCE_BUCKET: any; ASSETS: any; INTEGRATION_SERVICE_KEY?: string } }>();

  // CORS toàn cục
  app.use('*', cors({
    origin: (origin) => origin || '*',
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'x-service-key', 'x-user-id', 'x-role'],
    exposeHeaders: ['Content-Length', 'X-Request-Id'],
    credentials: true,
    maxAge: 86400
  }));

  // ============================================================================
  // SYSTEM & HEALTH ENDPOINTS (Acceptance Criteria 13 & 14)
  // ============================================================================
  app.get('/api/system/version', (c) => {
    return c.json(BUILD_METADATA);
  });

  app.get('/api/system/health', async (c) => {
    let dbStatus = 'ok';
    let storageStatus = 'ok';

    try {
      if (c.env?.DB) {
        const testRes = await c.env.DB.prepare('SELECT 1 as alive').first();
        if (!testRes || testRes.alive !== 1) dbStatus = 'error';
      } else {
        dbStatus = 'unbound';
      }
    } catch {
      dbStatus = 'error';
    }

    try {
      const bucket = c.env?.STORAGE || c.env?.EVIDENCE_BUCKET;
      if (!bucket) storageStatus = 'unbound';
    } catch {
      storageStatus = 'error';
    }

    const isOk = dbStatus === 'ok' && storageStatus === 'ok';
    return c.json({
      status: isOk ? 'ok' : 'degraded',
      database: dbStatus,
      storage: storageStatus,
      environment: 'production'
    }, isOk ? 200 : 503);
  });

  const returnHealth = (c: any) => {
    return c.json({
      ok: true,
      status: 'healthy',
      service: 'dustguard-unified-runtime',
      version: BUILD_METADATA.commit,
      timestamp: new Date().toISOString()
    });
  };

  app.get('/health', returnHealth);
  app.get('/api/health', returnHealth);

  // ============================================================================
  // R2 UPLOADS SERVING
  // ============================================================================
  const serveUpload = async (c: any) => {
    const rawPath = c.req.path.replace(/^\/(?:api\/)?uploads\//, '');
    const bucket = c.env?.STORAGE || c.env?.EVIDENCE_BUCKET;
    const res = await getObject(bucket, rawPath);
    if (res) return res;
    return c.text('Not Found', 404);
  };

  app.get('/uploads/*', serveUpload);
  app.get('/api/uploads/*', serveUpload);

  // ============================================================================
  // MOUNT DOMAIN ROUTERS
  // ============================================================================
  const communityRouter = createCommunityRouter();
  const operationsRouter = createOperationsRouter();

  // Side B (Operations) mounted on /api/operations AND /operations/api
  app.route('/api/operations', operationsRouter);
  app.route('/operations/api', operationsRouter);

  // Side A (Community) mounted on /api
  app.route('/api', communityRouter);

  // Fallback 404 cho API (RFC 7807)
  app.notFound((c) => {
    return c.json({
      type: 'https://tools.ietf.org/html/rfc7807',
      title: 'Endpoint Not Found',
      status: 404,
      detail: `Đường dẫn API '${c.req.path}' không tồn tại trên hệ thống.`,
      instance: c.req.path
    }, 404);
  });

  return app;
}

const app = createUnifiedApp();

export default {
  async fetch(request: Request, env: any, ctx: any) {
    const url = new URL(request.url);

    // 0. Chuyển hướng Chuẩn tắc (Canonical Auth Redirect): /operations/login -> /login?side=operations
    if (url.pathname === '/operations/login' || url.pathname === '/operations/login/') {
      const returnTo = url.searchParams.get('returnTo');
      const target = returnTo
        ? `/login?side=operations&returnTo=${encodeURIComponent(returnTo)}`
        : '/login?side=operations';
      return Response.redirect(new URL(target, request.url), 302);
    }

    // 1. Nếu là yêu cầu API hoặc Uploads -> Hono xử lý (Không bao giờ trả HTML cho API)
    if (
      url.pathname.startsWith('/api') ||
      url.pathname.startsWith('/operations/api') ||
      url.pathname.startsWith('/uploads') ||
      url.pathname === '/health'
    ) {
      return app.fetch(request, env, ctx);
    }

    // 2. Phục vụ Static Assets qua Cloudflare Workers Assets
    if (env.ASSETS) {
      // Nhánh Side B (/operations/*)
      if (url.pathname.startsWith('/operations')) {
        const hasFileExt = /\.[a-zA-Z0-9]+$/.test(url.pathname);
        if (hasFileExt) {
          // File tĩnh có đuôi (.js, .css, .webp...): phục vụ trực tiếp
          return env.ASSETS.fetch(request);
        }

        // SPA subroute của Side B (/operations/dashboard, /operations/cases...):
        // Thử fetch asset trước (nếu là /operations/ thì trả về operations/index.html)
        let res = await env.ASSETS.fetch(request);
        if (res.status === 404 || !res.ok) {
          res = await env.ASSETS.fetch(new Request(new URL('/operations/index.html', request.url), request));
        }
        return res;
      }

      // Nhánh Side A (Root / Community / Landing / Public)
      const hasFileExt = /\.[a-zA-Z0-9]+$/.test(url.pathname);
      if (hasFileExt) {
        return env.ASSETS.fetch(request);
      }

      let assetRes = await env.ASSETS.fetch(request);
      if (assetRes.status === 404 || !assetRes.ok) {
        // Fallback SPA cho các route như /reports, /dashboard, /map...
        assetRes = await env.ASSETS.fetch(new Request(new URL('/', request.url), request));
      }
      return assetRes;
    }

    return app.fetch(request, env, ctx);
  }
};
