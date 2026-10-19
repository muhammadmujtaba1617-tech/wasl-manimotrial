import crypto from 'crypto';
import { IPaymentGateway, InitiatePaymentRequest, InitiatePaymentResponse, PaymentWebhookPayload } from './payment.types.js';

export interface JazzCashConfig {
  merchantId?: string;
  password?: string;
  integritySalt?: string;
  returnUrl?: string;
}

export class JazzCashProvider implements IPaymentGateway {
  readonly gatewayName = 'jazzcash';
  private config: JazzCashConfig;

  constructor(config: JazzCashConfig = {}) {
    this.config = {
      merchantId: config.merchantId || process.env.JAZZCASH_MERCHANT_ID || 'MC_WASL_TEST',
      password: config.password || process.env.JAZZCASH_PASSWORD || 'test_pass_123',
      integritySalt: config.integritySalt || process.env.JAZZCASH_INTEGRITY_SALT || 'salt_key_abc',
      returnUrl: config.returnUrl || process.env.JAZZCASH_RETURN_URL || 'http://localhost:3001/payment/callback'
    };
  }

  private generateSecureHash(params: Record<string, string>): string {
    const sortedKeys = Object.keys(params).sort();
    let hashString = this.config.integritySalt || '';
    for (const key of sortedKeys) {
      if (params[key] !== undefined && params[key] !== '') {
        hashString += `&${params[key]}`;
      }
    }
    return crypto.createHmac('sha256', this.config.integritySalt || 'default').update(hashString).digest('hex').toUpperCase();
  }

  async initiatePayment(req: InitiatePaymentRequest): Promise<InitiatePaymentResponse> {
    const transactionRef = `JC-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`;
    const paymentId = `pay_jc_${Date.now()}`;
    const timestamp = new Date().toISOString();

    const postParams: Record<string, string> = {
      pp_MerchantID: this.config.merchantId!,
      pp_Password: this.config.password!,
      pp_TxnRefNo: transactionRef,
      pp_Amount: (req.amount * 100).toString(), // JazzCash requires amount in paisas
      pp_TxnCurrency: 'PKR',
      pp_BillReference: `bill_${req.candidateId.substring(0, 8)}`,
      pp_Description: req.description,
      pp_ReturnURL: this.config.returnUrl!
    };

    postParams['pp_SecureHash'] = this.generateSecureHash(postParams);

    return {
      paymentId,
      gateway: 'jazzcash',
      status: 'PENDING',
      transactionRef,
      amount: req.amount,
      currency: 'PKR',
      checkoutUrl: `https://sandbox.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform?txnRef=${transactionRef}`,
      instructions: 'Proceed to JazzCash portal with your JazzCash Mobile Account or Credit/Debit Card.',
      createdAt: timestamp
    };
  }

  async verifyWebhook(headers: Record<string, string>, rawBody: any): Promise<PaymentWebhookPayload> {
    const status = rawBody?.pp_ResponseCode === '000' ? 'PAID' : 'FAILED';
    const amount = rawBody?.pp_Amount ? parseInt(rawBody.pp_Amount, 10) / 100 : 0;
    
    return {
      gateway: 'jazzcash',
      transactionRef: rawBody?.pp_TxnRefNo || 'UNKNOWN',
      gatewayTxId: rawBody?.pp_RetreivalReferenceNo,
      status,
      amount,
      rawPayload: rawBody
    };
  }
}
