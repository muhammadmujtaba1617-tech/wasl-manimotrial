import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { buildApp } from '../src/server.js';

describe('Safety, Blocking, Incident Reporting & Incognito Privacy Controls', () => {
  let app: any;

  before(async () => {
    process.env.NODE_ENV = 'test';
    app = await buildApp();
  });

  after(async () => {
    if (app) {
      await app.close();
    }
  });

  it('allows candidate to block and unblock target candidates', async () => {
    // 1. Block
    const blockRes = await app.inject({
      method: 'POST',
      url: '/api/v1/safety/block',
      payload: { targetCandidateId: 'cand-male-suspicious-9' }
    });
    assert.strictEqual(blockRes.statusCode, 200);
    const blockBody = JSON.parse(blockRes.payload);
    assert.strictEqual(blockBody.success, true);

    // 2. Query Blocked list
    const listRes = await app.inject({
      method: 'GET',
      url: '/api/v1/safety/blocked'
    });
    assert.strictEqual(listRes.statusCode, 200);
    const listBody = JSON.parse(listRes.payload);
    assert.ok(listBody.blocked.includes('cand-male-suspicious-9'));

    // 3. Unblock
    const unblockRes = await app.inject({
      method: 'POST',
      url: '/api/v1/safety/unblock',
      payload: { targetCandidateId: 'cand-male-suspicious-9' }
    });
    assert.strictEqual(unblockRes.statusCode, 200);
  });

  it('allows candidate to report a profile and feeds into Admin moderation queue', async () => {
    // 1. Submit report
    const reportRes = await app.inject({
      method: 'POST',
      url: '/api/v1/safety/report',
      payload: {
        reportedCandidateId: 'cand-fake-202',
        reportedCandidateName: 'Fake Profile User',
        category: 'FAKE_PROFILE',
        reason: 'Impersonation using stock model photos',
        details: 'Reverse image search matches unsplash model portfolio.'
      }
    });
    assert.strictEqual(reportRes.statusCode, 201);
    const reportBody = JSON.parse(reportRes.payload);
    assert.strictEqual(reportBody.success, true);
    assert.strictEqual(reportBody.report.category, 'FAKE_PROFILE');
    const reportId = reportBody.report.id;

    // 2. Admin retrieves moderation queue
    const adminQueueRes = await app.inject({
      method: 'GET',
      url: '/api/v1/safety/admin/reports'
    });
    assert.strictEqual(adminQueueRes.statusCode, 200);
    const queueBody = JSON.parse(adminQueueRes.payload);
    assert.ok(queueBody.reports.some((r: any) => r.id === reportId));

    // 3. Admin bans the reported account
    const resolveRes = await app.inject({
      method: 'PATCH',
      url: `/api/v1/safety/admin/reports/${reportId}`,
      payload: { status: 'BANNED' }
    });
    assert.strictEqual(resolveRes.statusCode, 200);
    const resolveBody = JSON.parse(resolveRes.payload);
    assert.strictEqual(resolveBody.report.status, 'BANNED');
  });

  it('handles Incognito / Privacy mode activation and retrieval', async () => {
    // 1. Enable incognito
    const enableRes = await app.inject({
      method: 'PUT',
      url: '/api/v1/safety/incognito',
      payload: { isIncognito: true }
    });
    assert.strictEqual(enableRes.statusCode, 200);
    const enableBody = JSON.parse(enableRes.payload);
    assert.strictEqual(enableBody.isIncognito, true);

    // 2. Get status
    const getRes = await app.inject({
      method: 'GET',
      url: '/api/v1/safety/incognito'
    });
    assert.strictEqual(getRes.statusCode, 200);
    const getBody = JSON.parse(getRes.payload);
    assert.strictEqual(getBody.isIncognito, true);
  });
});
