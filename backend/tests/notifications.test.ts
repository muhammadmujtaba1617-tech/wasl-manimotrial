import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { buildApp } from '../src/server.js';

describe('Real-Time Notification Hub & Event Trigger Endpoints', () => {
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

  it('fetches user notifications and computes unread count', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/notifications/me'
    });
    assert.strictEqual(res.statusCode, 200);
    const body = JSON.parse(res.payload);
    assert.ok(Array.isArray(body.notifications));
    assert.ok(body.notifications.length >= 4);
    assert.strictEqual(typeof body.unreadCount, 'number');
  });

  it('marks a single notification as read', async () => {
    const res = await app.inject({
      method: 'PATCH',
      url: '/api/v1/notifications/notif-1/read'
    });
    assert.strictEqual(res.statusCode, 200);
    const body = JSON.parse(res.payload);
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.notification.read, true);
  });

  it('simulates live real-time notification triggers for guardian, match, proposal, verification', async () => {
    // 1. Guardian Accept trigger
    const guardianRes = await app.inject({
      method: 'POST',
      url: '/api/v1/notifications/simulate',
      payload: { type: 'GUARDIAN' }
    });
    assert.strictEqual(guardianRes.statusCode, 201);
    const guardianBody = JSON.parse(guardianRes.payload);
    assert.strictEqual(guardianBody.notification.type, 'GUARDIAN');
    assert.strictEqual(guardianBody.notification.title, 'Guardian Invite Accepted');
    assert.strictEqual(guardianBody.notification.actionUrl, '/family');

    // 2. High Match trigger
    const matchRes = await app.inject({
      method: 'POST',
      url: '/api/v1/notifications/simulate',
      payload: { type: 'MATCH' }
    });
    assert.strictEqual(matchRes.statusCode, 201);
    const matchBody = JSON.parse(matchRes.payload);
    assert.strictEqual(matchBody.notification.type, 'MATCH');
    assert.strictEqual(matchBody.notification.actionUrl, '/dashboard');

    // 3. Verification Badge trigger
    const badgeRes = await app.inject({
      method: 'POST',
      url: '/api/v1/notifications/simulate',
      payload: { type: 'VERIFICATION' }
    });
    assert.strictEqual(badgeRes.statusCode, 201);
    const badgeBody = JSON.parse(badgeRes.payload);
    assert.strictEqual(badgeBody.notification.type, 'VERIFICATION');
    assert.strictEqual(badgeBody.notification.actionUrl, '/profile');
  });

  it('marks all notifications as read', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/notifications/mark-all-read'
    });
    assert.strictEqual(res.statusCode, 200);
    const body = JSON.parse(res.payload);
    assert.strictEqual(body.success, true);

    const checkRes = await app.inject({
      method: 'GET',
      url: '/api/v1/notifications/me'
    });
    const checkBody = JSON.parse(checkRes.payload);
    assert.strictEqual(checkBody.unreadCount, 0);
  });
});
