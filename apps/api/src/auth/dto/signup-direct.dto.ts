import { IsNotEmpty, IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class SignupDirectDto {
  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name!: string;

  @IsString()
  @Matches(/^[0-9]{13}$/, { message: 'CNIC must be exactly 13 digits, no dashes' })
  cnic!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsOptional()
  @IsString()
  email?: string;
}