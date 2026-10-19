import { IPaymentGateway, InitiatePaymentRequest, InitiatePaymentResponse, PaymentWebhookPayload } from './payment.types.js';

export interface EasyPaisaConfig {
  storeId?: string;
  hashKey?: string;
  postBackUrl?: string;
}

export class EasyPaisaProvider implements IPaymentGateway {
  readonly gatewayName = 'easypaisa';
  private config: EasyPaisaConfig;

  constructor(config: EasyPaisaConfig = {}) {
    this.config = {
      storeId: config.storeId || process.env.EASYPAISA_STORE_ID || 'STORE_WASL_123',
      hashKey: config.hashKey || process.env.EASYPAISA_HASH_KEY || 'ep_hash_key',
      postBackUrl: config.postBackUrl || process.env.EASYPAISA_POSTBACK_URL || 'http://localhost:3001/payment/easypaisa-callback'
    };
  }

  async initiatePayment(req: InitiatePaymentRequest): Promise<InitiatePaymentResponse> {
    const transactionRef = `EP-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`;
    const paymentId = `pay_ep_${Date.now()}`;
    const timestamp = new Date().toISOString();

    return {
      paymentId,
      gateway: 'easypaisa',
      status: 'PENDING',
      transactionRef,
      amount: req.amount,
      currency: 'PKR',
      checkoutUrl: `https://easypay.easypaisa.com.pk/easypay/Index.jsf?orderRefNum=${transactionRef}&storeId=${this.config.storeId}`,
      instructions: 'Pay directly via your EasyPaisa Mobile Wallet account or OTC Token at any EasyPaisa shop.',
      createdAt: timestamp
    };
  }

  async verifyWebhook(headers: Record<string, string>, rawBody: any): Promise<PaymentWebhookPayload> {
    const isSuccess = rawBody?.responseCode === '0000' || rawBody?.status === 'PAID';
    return {
      gateway: 'easypaisa',
      transactionRef: rawBody?.orderRefNum || rawBody?.transactionId || 'UNKNOWN',
      gatewayTxId: rawBody?.epTxnId,
      status: isSuccess ? 'PAID' : 'FAILED',
      amount: Number(rawBody?.amount || 0),
      rawPayload: rawBody
    };
  }
}
