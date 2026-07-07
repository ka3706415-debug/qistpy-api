import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SmsProvider, SmsSendResult } from '../sms.provider';

/**
 * Twilio Verify SMS provider.
 * Uses Twilio Verify API — no phone number purchase needed.
 * Enabled when SMS_PROVIDER=twilio in .env
 *
 * Required env vars:
 *   TWILIO_ACCOUNT_SID   — starts with AC
 *   TWILIO_AUTH_TOKEN    — from Twilio console
 *   TWILIO_VERIFY_SID    — starts with VA
 */
@Injectable()
export class TwilioSmsProvider implements SmsProvider {
  private readonly logger     = new Logger('TwilioSMS');
  private readonly accountSid: string;
  private readonly authToken:  string;
  private readonly verifySid:  string;

  constructor(private readonly config: ConfigService) {
    this.accountSid = this.config.getOrThrow<string>('TWILIO_ACCOUNT_SID');
    this.authToken  = this.config.getOrThrow<string>('TWILIO_AUTH_TOKEN');
    this.verifySid  = this.config.getOrThrow<string>('TWILIO_VERIFY_SID');
  }

  async send(to: string, message: string): Promise<SmsSendResult> {
    // Twilio Verify sends its own OTP message automatically.
    // We trigger a verification and the OTP goes directly to the user.
    const normalised = this.toE164(to);
    const url = `https://verify.twilio.com/v2/Services/${this.verifySid}/Verifications`;

    const body = new URLSearchParams({
      To:      normalised,
      Channel: 'sms',
    });

    const credentials = Buffer.from(
      `${this.accountSid}:${this.authToken}`,
    ).toString('base64');

    try {
      const response = await fetch(url, {
        method:  'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type':  'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      });

      const data = await response.json() as any;

      if (!response.ok) {
        this.logger.error(
          `Twilio Verify error ${data.code}: ${data.message} (to: ${normalised})`,
        );
        return { success: false, error: data.message ?? 'Twilio Verify request failed' };
      }

      this.logger.log(
        `Twilio Verify OTP sent to ${normalised} — SID: ${data.sid} status: ${data.status}`,
      );
      return { success: true, providerMessageId: data.sid };

    } catch (err) {
      const error = err instanceof Error ? err.message : 'unknown';
      this.logger.error(`Twilio Verify fetch failed: ${error}`);
      return { success: false, error };
    }
  }

  /**
   * Convert Pakistani number to E.164 format.
   * 0300xxxxxxx  → +92300xxxxxxx
   * +92300xxxxxxx → unchanged
   */
  private toE164(phone: string): string {
    const digits = phone.replace(/[\s\-]/g, '');
    if (digits.startsWith('+'))  return digits;
    if (digits.startsWith('0'))  return '+92' + digits.slice(1);
    if (digits.startsWith('92')) return '+' + digits;
    return '+92' + digits;
  }
}