import { FastifyPluginAsync } from 'fastify';
import { defaultPaymentService } from './payment.service.js';
import { PaymentGatewayType, PaymentPurpose } from './payment.types.js';

export const paymentRoutes: FastifyPluginAsync = async (app) => {
  // Initiate payment (JazzCash / EasyPaisa / Stripe)
  app.post<{
    Body: {
      candidateId: string;
      amount: number;
      currency?: 'PKR' | 'USD';
      purpose: PaymentPurpose;
      gateway: PaymentGatewayType;
      customerPhone?: string;
      customerEmail?: string;
      description?: string;
    };
  }>('/initiate', async (req, reply) => {
    const { candidateId, amount, currency = 'PKR', purpose, gateway, customerPhone, customerEmail, description } = req.body;

    if (!candidateId || !amount || !purpose || !gateway) {
      return reply.status(400).send({ error: 'Missing required payment parameters (candidateId, amount, purpose, gateway)' });
    }

    const response = await defaultPaymentService.initiate({
      candidateId,
      amount,
      currency,
      purpose,
      gateway,
      customerPhone,
      customerEmail,
      description: description || `Wasl Matrimonial Service: ${purpose}`
    });

    return reply.status(201).send(response);
  });

  // Query transaction status
  app.get<{
    Params: { ref: string };
  }>('/status/:ref', async (req, reply) => {
    const tx = defaultPaymentService.getTransaction(req.params.ref);
    if (!tx) {
      return reply.status(404).send({ error: 'Transaction reference not found' });
    }
    return tx;
  });

  // Get candidate payment history
  app.get<{
    Params: { candidateId: string };
  }>('/history/:candidateId', async (req, reply) => {
    const history = defaultPaymentService.getCandidateTransactions(req.params.candidateId);
    return { transactions: history };
  });

  // Webhook listener for JazzCash, EasyPaisa, Stripe
  app.post<{
    Params: { gateway: PaymentGatewayType };
  }>('/webhook/:gateway', async (req, reply) => {
    const { gateway } = req.params;
    const headers = req.headers as Record<string, string>;
    const body = req.body;

    try {
      const record = await defaultPaymentService.handleWebhook(gateway, headers, body);
      return reply.status(200).send({ received: true, status: record.status, ref: record.transactionRef });
    } catch (err: any) {
      return reply.status(400).send({ error: err?.message || 'Webhook processing failed' });
    }
  });
};
