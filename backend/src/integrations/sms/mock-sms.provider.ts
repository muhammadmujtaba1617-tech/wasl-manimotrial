import { ISmsProvider, SendSmsOptions, SmsSendResult } from './sms.types.js';

export class MockSmsProvider implements ISmsProvider {
  readonly name = 'mock';
  private sentMessages: Array<{ to: string; message: string; timestamp: string }> = [];

  async sendSms(options: SendSmsOptions): Promise<SmsSendResult> {
    const timestamp = new Date().toISOString();
    this.sentMessages.push({
      to: options.to,
      message: options.message,
      timestamp
    });

    return {
      success: true,
      messageId: `mock-msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      provider: 'mock',
      timestamp
    };
  }

  verifyNumberFormat(phone: string): boolean {
    const clean = phone.replace(/[\s-]/g, '');
    return /^(\+92|0092|92|0)?3[0-9]{9}$/.test(clean) || /^\+[1-9]\d{1,14}$/.test(clean);
  }

  getSentMessages() {
    return [...this.sentMessages];
  }

  clear() {
    this.sentMessages = [];
  }
}
