import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MockSmsProvider } from './providers/mock-sms.provider';
import { TwilioSmsProvider } from './providers/twilio-sms.provider';
import { SMS_PROVIDER } from './sms.provider';
import { SmsService } from './sms.service';

/**
 * @Global — any feature that needs SMS (OTPs, reminders, notifications)
 * simply injects SmsService.
 *
 * Switch provider by setting SMS_PROVIDER in .env:
 *   SMS_PROVIDER=mock    → logs to console (development)
 *   SMS_PROVIDER=twilio  → sends real SMS via Twilio
 */
@Global()
@Module({
  providers: [
    MockSmsProvider,
    TwilioSmsProvider,
    {
      provide: SMS_PROVIDER,
      useFactory: (
        config: ConfigService,
        mock: MockSmsProvider,
        twilio: TwilioSmsProvider,
      ) => {
        const provider = config.get<string>('SMS_PROVIDER') ?? 'mock';
        switch (provider) {
          case 'twilio':
            return twilio;
          case 'mock':
            return mock;
          default:
            // Unknown provider → fall back to mock so OTPs still
            // appear in logs rather than silently disappearing.
            return mock;
        }
      },
      inject: [ConfigService, MockSmsProvider, TwilioSmsProvider],
    },
    SmsService,
  ],
  exports: [SmsService],
})
export class SmsModule {}