export type PaymentGatewayType = 'jazzcash' | 'easypaisa' | 'stripe' | 'mock';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
export type PaymentPurpose = 'PROPOSAL_CREDITS' | 'PRIORITY_VERIFICATION' | 'GUARDIAN_SUPERVISION_PLUS';

export interface InitiatePaymentRequest {
  candidateId: string;
  amount: number; // In PKR or USD (for Stripe)
  currency: 'PKR' | 'USD';
  purpose: PaymentPurpose;
  gateway: PaymentGatewayType;
  customerPhone?: string;
  customerEmail?: string;
  description: string;
  metadata?: Record<string, any>;
}

export interface InitiatePaymentResponse {
  paymentId: string;
  gateway: PaymentGatewayType;
  status: PaymentStatus;
  checkoutUrl?: string;
  transactionRef: string;
  amount: number;
  currency: string;
  createdAt: string;
  instructions?: string;
}

export interface PaymentWebhookPayload {
  gateway: PaymentGatewayType;
  transactionRef: string;
  gatewayTxId?: string;
  status: PaymentStatus;
  amount: number;
  rawPayload: Record<string, any>;
}

export interface IPaymentGateway {
  readonly gatewayName: PaymentGatewayType;
  initiatePayment(req: InitiatePaymentRequest): Promise<InitiatePaymentResponse>;
  verifyWebhook(headers: Record<string, string>, rawBody: any): Promise<PaymentWebhookPayload>;
}
