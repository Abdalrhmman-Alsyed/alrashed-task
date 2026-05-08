import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateNotificationDto {
  @IsOptional()
  @IsString()
  @MaxLength(150)
  title?: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  type?: string;

  @IsOptional()
  @IsBoolean()
  is_read?: boolean;
}
