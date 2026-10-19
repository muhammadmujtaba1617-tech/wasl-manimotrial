import { ISmsProvider, SendSmsOptions, SmsSendResult } from './sms.types.js';
import { MockSmsProvider } from './mock-sms.provider.js';
import { TwilioSmsProvider } from './twilio-sms.provider.js';
import { PakistanSmsProvider } from './pakistan-sms.provider.js';

export class SmsService {
  private providers: ISmsProvider[] = [];
  private defaultMockProvider: MockSmsProvider;

  constructor(providers?: ISmsProvider[]) {
    this.defaultMockProvider = new MockSmsProvider();
    if (providers && providers.length > 0) {
      this.providers = providers;
    } else {
      // Auto-configure providers based on environment flags
      if (process.env.PK_SMS_API_KEY) {
        this.providers.push(new PakistanSmsProvider({ providerType: 'jazz-sms' }));
      }
      if (process.env.TWILIO_ACCOUNT_SID) {
        this.providers.push(new TwilioSmsProvider());
      }
      // Fallback mock provider always available in dev/test
      this.providers.push(this.defaultMockProvider);
    }
  }

  async sendOtp(phone: string, code: string): Promise<SmsSendResult> {
    const message = `Your Wasl verification code is: ${code}. Valid for 5 minutes. Never share this code with anyone.`;
    return this.sendWithFailover({
      to: phone,
      message,
      templateId: 'OTP_VERIFICATION',
      templateParams: { code }
    });
  }

  async sendGuardianInvite(phone: string, candidateName: string, inviteUrl: string): Promise<SmsSendResult> {
    const message = `Assalam-o-Alaikum, ${candidateName} has invited you to join their Family Workspace on Wasl Matrimonial. Review profiles and proposals here: ${inviteUrl}`;
    return this.sendWithFailover({
      to: phone,
      message,
      templateId: 'GUARDIAN_INVITE',
      templateParams: { candidateName, inviteUrl }
    });
  }

  async sendWithFailover(options: SendSmsOptions): Promise<SmsSendResult> {
    let lastError = 'No SMS provider configured';

    for (const provider of this.providers) {
      if (!provider.verifyNumberFormat(options.to)) {
        continue;
      }

      try {
        const result = await provider.sendSms(options);
        if (result.success) {
          return result;
        }
        lastError = result.error || 'Provider returned unsuccessful status';
      } catch (err: any) {
        lastError = err?.message || 'Provider threw unexpected error';
      }
    }

    return {
      success: false,
      provider: 'mock',
      error: `All SMS dispatch attempts failed: ${lastError}`,
      timestamp: new Date().toISOString()
    };
  }

  getMockProvider(): MockSmsProvider {
    const found = this.providers.find(p => p.name === 'mock');
    return (found as MockSmsProvider) || this.defaultMockProvider;
  }
}

export const defaultSmsService = new SmsService();
