import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Min,
  ValidateNested,
} from 'class-validator';

export class OracleProductImageDto {
  @IsString() publicId!: string;
  @IsString() url!: string;
  @IsOptional() @IsString() alt?: string;
  @IsOptional() @IsBoolean() isPrimary?: boolean;
}

export class ImportOracleProductDto {
  @IsString()
  categoryId!: string;

  @IsOptional()
  @IsString()
  brandId?: string;

  @IsString()
  @Length(10, 10_000)
  description!: string;

  @IsOptional()
  @IsString()
  @Length(0, 300)
  shortDescription?: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  stock!: number;

  @IsArray()
  @ArrayMinSize(1, { message: 'At least one image is required' })
  @ArrayMaxSize(8)
  @ValidateNested({ each: true })
  @Type(() => OracleProductImageDto)
  images!: OracleProductImageDto[];
}