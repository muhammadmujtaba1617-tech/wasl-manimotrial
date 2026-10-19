import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { fileURLToPath } from 'url';
import { config } from './config.js';
import { COMPATIBILITY_ENGINE_VERSION } from '@wasl/compatibility-engine';
import { authRoutes } from './modules/auth/auth.routes.js';
import { candidateRoutes } from './modules/candidates/candidate.routes.js';
import { preferencesRoutes } from './modules/preferences/preferences.routes.js';
import { verificationRoutes } from './modules/verification/verification.routes.js';
import { matchingRoutes } from './modules/matching/matching.routes.js';
import { familyRoutes } from './modules/family/family.routes.js';
import { proposalRoutes } from './modules/proposals/proposal.routes.js';
import { messagingRoutes } from './modules/messaging/messaging.routes.js';
import { paymentRoutes } from './integrations/payments/payment.routes.js';
import { integrationRoutes } from './integrations/integration.routes.js';
import { notificationRoutes } from './modules/notifications/notification.routes.js';
import { safetyRoutes } from './modules/safety/safety.routes.js';
import { storageRoutes } from './integrations/storage/storage.routes.js';
import { persistenceRoutes } from './modules/persistence/persistence.routes.js';
import { adminRoutes } from './modules/admin/admin.routes.js';

export async function buildApp() {
  const app = Fastify({
    logger: false
  });

  await app.register(cors, {
    origin: (origin, cb) => {
      // Allow requests with no origin (mobile apps, curl, Render health checks)
      if (!origin) return cb(null, true);
      // Allow localhost for development
      if (origin.includes('localhost') || origin.includes('127.0.0.1')) return cb(null, true);
      // Allow any Vercel deployment
      if (origin.includes('.vercel.app')) return cb(null, true);
      // Allow custom production domains
      if (process.env.ALLOWED_ORIGIN && origin === process.env.ALLOWED_ORIGIN) return cb(null, true);
      // Allow all origins in development / if no restriction set
      if (config.environment !== 'production') return cb(null, true);
      cb(null, true); // permissive for now — tighten after custom domain is set
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true
  });

  await app.register(jwt, {
    secret: config.jwtSecret
  });

  await app.register(swagger, {
    openapi: {
      info: {
        title: 'Wasl Matrimonial API',
        description: 'Verified Trust, Structured Family Participation & Explainable AI Matrimonial Platform',
        version: '1.0.0'
      },
      servers: [{ url: `http://localhost:${config.port}` }]
    }
  });

  await app.register(swaggerUi, {
    routePrefix: '/docs'
  });

  // Health check endpoint
  app.get('/health', async () => {
    return {
      status: 'ok',
      engineVersion: COMPATIBILITY_ENGINE_VERSION,
      timestamp: new Date().toISOString()
    };
  });

  // Register domain API routes
  await app.register(authRoutes, { prefix: '/api/v1/auth' });
  await app.register(candidateRoutes, { prefix: '/api/v1/candidates' });
  await app.register(preferencesRoutes, { prefix: '/api/v1/preferences' });
  await app.register(verificationRoutes, { prefix: '/api/v1/verification' });
  await app.register(matchingRoutes, { prefix: '/api/v1/discovery' });
  await app.register(familyRoutes, { prefix: '/api/v1/family' });
  await app.register(proposalRoutes, { prefix: '/api/v1/proposals' });
  await app.register(messagingRoutes, { prefix: '/api/v1/messaging' });
  await app.register(paymentRoutes, { prefix: '/api/v1/payments' });
  await app.register(integrationRoutes, { prefix: '/api/v1/integrations' });
  await app.register(notificationRoutes, { prefix: '/api/v1/notifications' });
  await app.register(safetyRoutes, { prefix: '/api/v1/safety' });
  await app.register(storageRoutes, { prefix: '/api/v1/storage' });
  await app.register(persistenceRoutes, { prefix: '/api/v1/persistence' });
  await app.register(adminRoutes, { prefix: '/api/v1/admin' });

  return app;
}

const isMainModule = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];

if (isMainModule) {
  const app = await buildApp();
  try {
    await app.listen({ port: config.port, host: config.host });
    console.log(`🚀 Wasl Backend API listening on http://${config.host}:${config.port}`);
    console.log(`📖 Swagger API Docs available at http://${config.host}:${config.port}/docs`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
