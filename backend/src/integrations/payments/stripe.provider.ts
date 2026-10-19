import { IPaymentGateway, InitiatePaymentRequest, InitiatePaymentResponse, PaymentWebhookPayload } from './payment.types.js';

export interface StripeConfig {
  secretKey?: string;
  webhookSecret?: string;
  successUrl?: string;
  cancelUrl?: string;
}

export class StripeProvider implements IPaymentGateway {
  readonly gatewayName = 'stripe';
  private config: StripeConfig;

  constructor(config: StripeConfig = {}) {
    this.config = {
      secretKey: config.secretKey || process.env.STRIPE_SECRET_KEY,
      webhookSecret: config.webhookSecret || process.env.STRIPE_WEBHOOK_SECRET,
      successUrl: config.successUrl || 'http://localhost:3001/payment/success',
      cancelUrl: config.cancelUrl || 'http://localhost:3001/payment/cancel'
    };
  }

  async initiatePayment(req: InitiatePaymentRequest): Promise<InitiatePaymentResponse> {
    const transactionRef = `cs_test_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const paymentId = `pay_stripe_${Date.now()}`;
    const timestamp = new Date().toISOString();

    return {
      paymentId,
      gateway: 'stripe',
      status: 'PENDING',
      transactionRef,
      amount: req.amount,
      currency: req.currency || 'USD',
      checkoutUrl: `https://checkout.stripe.com/c/pay/${transactionRef}`,
      instructions: 'Complete your card payment via Stripe secure international checkout.',
      createdAt: timestamp
    };
  }

  async verifyWebhook(headers: Record<string, string>, rawBody: any): Promise<PaymentWebhookPayload> {
    const eventType = rawBody?.type;
    const isSuccess = eventType === 'checkout.session.completed' || rawBody?.status === 'succeeded';
    
    return {
      gateway: 'stripe',
      transactionRef: rawBody?.data?.object?.id || rawBody?.id || 'UNKNOWN',
      gatewayTxId: rawBody?.data?.object?.payment_intent,
      status: isSuccess ? 'PAID' : 'FAILED',
      amount: Number(rawBody?.data?.object?.amount_total || 0) / 100,
      rawPayload: rawBody
    };
  }
}
