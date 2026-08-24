import { Global, Module } from '@nestjs/common';
import { MockSmsProvider } from './providers/mock-sms.provider';
import { SMS_PROVIDER } from './sms.provider';
import { SmsService } from './sms.service';

/**
 * @Global — any feature that needs SMS (OTPs, reminders, notifications)
 * simply injects SmsService.
 *
 * Only Mock provider is used — logs OTP to console.
 */
@Global()
@Module({
  providers: [
    MockSmsProvider,
    {
      provide: SMS_PROVIDER,
      useFactory: (mock: MockSmsProvider) => mock,
      inject: [MockSmsProvider],
    },
    SmsService,
  ],
  exports: [SmsService],
})
export class SmsModule {}