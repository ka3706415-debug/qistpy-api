import { Type } from 'class-transformer';
import { IsInt, IsNumber, Max, Min } from 'class-validator';

/**
 * Vendor sets installment plan values manually (brief Phase 4: no algorithmic pricing).
 * totalPayable is computed server-side: advance + (monthly * months).
 * markup fields are informational — vendor provides them for transparency.
 *
 * Allowed durations inlined to avoid workspace package resolution issues.
 */
export class CreateInstallmentPlanDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(36)
  durationMonths!: number;
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  advanceAmount!: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  monthlyAmount!: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  markupPercentage!: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  markupAmount!: number;
}
