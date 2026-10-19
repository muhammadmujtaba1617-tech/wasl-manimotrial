import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { FastifyInstance } from 'fastify';
import { buildApp } from '../src/server.js';
import { defaultSmsService } from '../src/integrations/sms/sms.service.js';
import { defaultNadraClient } from '../src/integrations/kyc/nadra.client.js';
import { defaultPaymentService } from '../src/integrations/payments/payment.service.js';

describe('Phase 6: 3rd-Party Integrations (SMS, NADRA Verisys, Payments)', () => {
  let app: FastifyInstance;

  before(async () => {
    app = await buildApp();
    await app.ready();
  });

  after(async () => {
    await app.close();
  });

  test('SMS Service sends OTP and Guardian Invite with mock failover fallback', async () => {
    const otpRes = await defaultSmsService.sendOtp('+923001234567', '491028');
    assert.equal(otpRes.success, true);
    assert.equal(otpRes.provider, 'mock');

    const inviteRes = await defaultSmsService.sendGuardianInvite('03219876543', 'Ahmad Khan', 'https://wasl.pk/invite/abc');
    assert.equal(inviteRes.success, true);
  });

  test('NADRA Verisys Client validates Pakistani CNIC format and simulates match verification', async () => {
    // Valid 13-digit format
    const validResult = await defaultNadraClient.verifyCnic({
      cnicNumber: '35202-1234567-1',
      fullName: 'Muhammad Ahmad',
      fatherOrHusbandName: 'Tariq Mehmood',
      gender: 'MALE'
    });

    assert.equal(validResult.verified, true);
    assert.equal(validResult.cnicNormalized, '35202-1234567-1');
    assert.equal(validResult.matchScore >= 90, true);
    assert.equal(validResult.citizenRecord?.fullName, 'MUHAMMAD AHMAD');

    // Invalid format rejection
    await assert.rejects(
      async () => {
        await defaultNadraClient.verifyCnic({
          cnicNumber: '123', // invalid length
          fullName: 'Test'
        });
      },
      /Invalid Pakistani CNIC format/
    );
  });

  test('Payment Service handles JazzCash initiation and webhook processing', async () => {
    // 1. Initiate JazzCash Payment
    const initRes = await app.inject({
      method: 'POST',
      url: '/api/v1/payments/initiate',
      payload: {
        candidateId: 'cand_test_999',
        amount: 2500,
        currency: 'PKR',
        purpose: 'PROPOSAL_CREDITS',
        gateway: 'jazzcash',
        customerPhone: '03001234567'
      }
    });

    assert.equal(initRes.statusCode, 201);
    const initData = JSON.parse(initRes.body);
    assert.equal(initData.gateway, 'jazzcash');
    assert.equal(initData.status, 'PENDING');
    assert.ok(initData.transactionRef);

    // 2. Query status
    const statusRes = await app.inject({
      method: 'GET',
      url: `/api/v1/payments/status/${initData.transactionRef}`
    });
    assert.equal(statusRes.statusCode, 200);

    // 3. Webhook callback
    const webhookRes = await app.inject({
      method: 'POST',
      url: '/api/v1/payments/webhook/jazzcash',
      payload: {
        pp_ResponseCode: '000',
        pp_TxnRefNo: initData.transactionRef,
        pp_Amount: '250000',
        pp_RetreivalReferenceNo: 'JC_TX_8831'
      }
    });
    assert.equal(webhookRes.statusCode, 200);
    const webhookData = JSON.parse(webhookRes.body);
    assert.equal(webhookData.status, 'PAID');
  });

  test('Payment Service handles EasyPaisa and Stripe initiation', async () => {
    // EasyPaisa
    const epRes = await app.inject({
      method: 'POST',
      url: '/api/v1/payments/initiate',
      payload: {
        candidateId: 'cand_test_999',
        amount: 1500,
        purpose: 'PRIORITY_VERIFICATION',
        gateway: 'easypaisa'
      }
    });
    assert.equal(epRes.statusCode, 201);
    const epData = JSON.parse(epRes.body);
    assert.equal(epData.gateway, 'easypaisa');

    // Stripe
    const stripeRes = await app.inject({
      method: 'POST',
      url: '/api/v1/payments/initiate',
      payload: {
        candidateId: 'cand_test_999',
        amount: 25,
        currency: 'USD',
        purpose: 'GUARDIAN_SUPERVISION_PLUS',
        gateway: 'stripe'
      }
    });
    assert.equal(stripeRes.statusCode, 201);
    const stripeData = JSON.parse(stripeRes.body);
    assert.equal(stripeData.gateway, 'stripe');
  });
});
