import { IPaymentGateway, InitiatePaymentRequest, InitiatePaymentResponse, PaymentGatewayType, PaymentStatus, PaymentWebhookPayload } from './payment.types.js';
import { JazzCashProvider } from './jazzcash.provider.js';
import { EasyPaisaProvider } from './easypaisa.provider.js';
import { StripeProvider } from './stripe.provider.js';

export interface PaymentTransactionRecord {
  id: string;
  candidateId: string;
  amount: number;
  currency: string;
  purpose: string;
  gateway: PaymentGatewayType;
  status: PaymentStatus;
  transactionRef: string;
  gatewayTxId?: string;
  createdAt: string;
  updatedAt: string;
}

export class PaymentService {
  private gateways: Map<PaymentGatewayType, IPaymentGateway> = new Map();
  private transactions: Map<string, PaymentTransactionRecord> = new Map();

  constructor() {
    this.gateways.set('jazzcash', new JazzCashProvider());
    this.gateways.set('easypaisa', new EasyPaisaProvider());
    this.gateways.set('stripe', new StripeProvider());
  }

  async initiate(req: InitiatePaymentRequest): Promise<InitiatePaymentResponse> {
    const gateway = this.gateways.get(req.gateway);
    if (!gateway) {
      throw new Error(`Unsupported payment gateway: ${req.gateway}`);
    }

    const response = await gateway.initiatePayment(req);

    const record: PaymentTransactionRecord = {
      id: response.paymentId,
      candidateId: req.candidateId,
      amount: req.amount,
      currency: req.currency,
      purpose: req.purpose,
      gateway: req.gateway,
      status: 'PENDING',
      transactionRef: response.transactionRef,
      createdAt: response.createdAt,
      updatedAt: response.createdAt
    };

    this.transactions.set(response.transactionRef, record);
    this.transactions.set(response.paymentId, record);

    return response;
  }

  async handleWebhook(gatewayType: PaymentGatewayType, headers: Record<string, string>, payload: any): Promise<PaymentTransactionRecord> {
    const gateway = this.gateways.get(gatewayType);
    if (!gateway) {
      throw new Error(`Invalid gateway for webhook: ${gatewayType}`);
    }

    const verifiedResult: PaymentWebhookPayload = await gateway.verifyWebhook(headers, payload);
    const existing = this.transactions.get(verifiedResult.transactionRef);

    if (!existing) {
      // Create record if initiated externally
      const newRecord: PaymentTransactionRecord = {
        id: `pay_${Date.now()}`,
        candidateId: payload?.candidateId || 'system',
        amount: verifiedResult.amount,
        currency: gatewayType === 'stripe' ? 'USD' : 'PKR',
        purpose: 'PROPOSAL_CREDITS',
        gateway: gatewayType,
        status: verifiedResult.status,
        transactionRef: verifiedResult.transactionRef,
        gatewayTxId: verifiedResult.gatewayTxId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this.transactions.set(verifiedResult.transactionRef, newRecord);
      return newRecord;
    }

    existing.status = verifiedResult.status;
    existing.gatewayTxId = verifiedResult.gatewayTxId;
    existing.updatedAt = new Date().toISOString();

    return existing;
  }

  getTransaction(refOrId: string): PaymentTransactionRecord | undefined {
    return this.transactions.get(refOrId);
  }

  getCandidateTransactions(candidateId: string): PaymentTransactionRecord[] {
    const list: PaymentTransactionRecord[] = [];
    const seen = new Set<string>();
    for (const tx of this.transactions.values()) {
      if (tx.candidateId === candidateId && !seen.has(tx.id)) {
        seen.add(tx.id);
        list.push(tx);
      }
    }
    return list;
  }
}

export const defaultPaymentService = new PaymentService();
