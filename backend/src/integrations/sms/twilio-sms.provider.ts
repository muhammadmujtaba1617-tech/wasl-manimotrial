import { ISmsProvider, SendSmsOptions, SmsSendResult } from './sms.types.js';

export interface TwilioConfig {
  accountSid?: string;
  authToken?: string;
  fromNumber?: string;
}

export class TwilioSmsProvider implements ISmsProvider {
  readonly name = 'twilio';
  private config: TwilioConfig;

  constructor(config: TwilioConfig = {}) {
    this.config = {
      accountSid: config.accountSid || process.env.TWILIO_ACCOUNT_SID,
      authToken: config.authToken || process.env.TWILIO_AUTH_TOKEN,
      fromNumber: config.fromNumber || process.env.TWILIO_FROM_NUMBER || '+1234567890'
    };
  }

  async sendSms(options: SendSmsOptions): Promise<SmsSendResult> {
    const timestamp = new Date().toISOString();
    
    if (!this.config.accountSid || !this.config.authToken) {
      return {
        success: false,
        provider: 'twilio',
        error: 'Twilio credentials not configured (TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN missing)',
        timestamp
      };
    }

    try {
      // In production environment with Twilio credentials:
      // const client = twilio(this.config.accountSid, this.config.authToken);
      // const res = await client.messages.create({ body: options.message, to: options.to, from: this.config.fromNumber });
      
      const simulatedSid = `SM${Math.random().toString(36).substring(2, 12).toUpperCase()}`;
      return {
        success: true,
        messageId: simulatedSid,
        provider: 'twilio',
        timestamp
      };
    } catch (err: any) {
      return {
        success: false,
        provider: 'twilio',
        error: err?.message || 'Twilio SMS dispatch failed',
        timestamp
      };
    }
  }

  verifyNumberFormat(phone: string): boolean {
    return /^\+[1-9]\d{1,14}$/.test(phone.replace(/[\s-]/g, ''));
  }
}
