export interface SendSmsOptions {
  to: string; // E.164 format e.g. +923001234567 or 03001234567
  message: string;
  templateId?: string;
  templateParams?: Record<string, string>;
}

export interface SmsSendResult {
  success: boolean;
  messageId?: string;
  provider: 'mock' | 'twilio' | 'jazz-sms' | 'telenor-sms';
  error?: string;
  timestamp: string;
}

export interface ISmsProvider {
  readonly name: 'mock' | 'twilio' | 'jazz-sms' | 'telenor-sms';
  sendSms(options: SendSmsOptions): Promise<SmsSendResult>;
  verifyNumberFormat(phone: string): boolean;
}
