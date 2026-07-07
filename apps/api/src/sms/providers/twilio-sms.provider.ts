import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SmsProvider, SmsSendResult } from '../sms.provider';

/**
 * Twilio SMS provider.
 * Uses Twilio REST API directly (no SDK dependency) to keep bundle small.
 * Enabled when SMS_PROVIDER=twilio in .env
 *
 * Required env vars:
 *   TWILIO_ACCOUNT_SID   — starts with AC
 *   TWILIO_AUTH_TOKEN    — from Twilio console
 *   TWILIO_PHONE_NUMBER  — your Twilio number e.g. +14155552671
 */
@Injectable()
export class TwilioSmsProvider implements SmsProvider {
  private readonly logger = new Logger('TwilioSMS');
  private readonly accountSid: string;
  private readonly authToken:  string;
  private readonly fromNumber: string;

  constructor(private readonly config: ConfigService) {
    this.accountSid = this.config.getOrThrow<string>('TWILIO_ACCOUNT_SID');
    this.authToken  = this.config.getOrThrow<string>('TWILIO_AUTH_TOKEN');
    this.fromNumber = this.config.getOrThrow<string>('TWILIO_PHONE_NUMBER');
  }

  async send(to: string, message: string): Promise<SmsSendResult> {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json`;

    // Twilio expects E.164 format: +923001234567
    const normalised = this.toE164(to);

    const body = new URLSearchParams({
      To:   normalised,
      From: this.fromNumber,
      Body: message,
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
          `Twilio error ${data.code}: ${data.message} (to: ${normalised})`,
        );
        return { success: false, error: data.message ?? 'Twilio request failed' };
      }

      this.logger.log(`SMS sent via Twilio to ${normalised} — SID: ${data.sid}`);
      return { success: true, providerMessageId: data.sid };

    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown';
      this.logger.error(`Twilio fetch failed: ${message}`);
      return { success: false, error: message };
    }
  }

  /**
   * Convert local Pakistani number to E.164.
   * 0300xxxxxxx  → +92300xxxxxxx
   * +92300xxxxxxx → unchanged
   */
  private toE164(phone: string): string {
    const digits = phone.replace(/\s|-/g, '');
    if (digits.startsWith('+')) return digits;
    if (digits.startsWith('0'))  return '+92' + digits.slice(1);
    if (digits.startsWith('92')) return '+' + digits;
    return '+92' + digits;
  }
}
