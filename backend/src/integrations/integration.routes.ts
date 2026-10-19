import { FastifyPluginAsync } from 'fastify';
import { defaultSmsService } from './sms/sms.service.js';
import { defaultNadraClient } from './kyc/nadra.client.js';

export const integrationRoutes: FastifyPluginAsync = async (app) => {
  // SMS dispatch test & preview endpoint
  app.post<{
    Body: { phone: string; message?: string; type?: 'OTP' | 'GUARDIAN_INVITE' | 'CUSTOM'; code?: string; candidateName?: string; inviteUrl?: string };
  }>('/sms/send', async (req, reply) => {
    const { phone, type = 'OTP', code = '543219', candidateName = 'Zara', inviteUrl = 'http://localhost:3001/family/invite/123' } = req.body;

    if (!phone) {
      return reply.status(400).send({ error: 'Phone number is required' });
    }

    if (type === 'OTP') {
      const result = await defaultSmsService.sendOtp(phone, code);
      return reply.send(result);
    } else if (type === 'GUARDIAN_INVITE') {
      const result = await defaultSmsService.sendGuardianInvite(phone, candidateName, inviteUrl);
      return reply.send(result);
    } else {
      const result = await defaultSmsService.sendWithFailover({
        to: phone,
        message: req.body.message || 'Notification from Wasl Matrimonial platform'
      });
      return reply.send(result);
    }
  });

  // NADRA CNIC Verisys verification endpoint
  app.post<{
    Body: { cnicNumber: string; fullName: string; fatherOrHusbandName?: string; dateOfBirth?: string; gender?: 'MALE' | 'FEMALE' };
  }>('/nadra/verify', async (req, reply) => {
    const { cnicNumber, fullName, fatherOrHusbandName, dateOfBirth, gender } = req.body;

    if (!cnicNumber || !fullName) {
      return reply.status(400).send({ error: 'cnicNumber and fullName are required for NADRA verification' });
    }

    try {
      const result = await defaultNadraClient.verifyCnic({
        cnicNumber,
        fullName,
        fatherOrHusbandName,
        dateOfBirth,
        gender
      });
      return reply.send(result);
    } catch (err: any) {
      return reply.status(400).send({ error: err?.message || 'NADRA verification failed' });
    }
  });
};
