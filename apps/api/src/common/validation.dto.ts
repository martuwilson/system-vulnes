import { IsString, IsNotEmpty, IsUrl, IsUUID, IsEnum, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export enum ScanType {
  FULL = 'FULL',
  QUICK = 'QUICK',
  CUSTOM = 'CUSTOM'
}

export class StartScanDto {
  @IsString()
  @IsNotEmpty()
  domain: string;

  @IsUUID()
  companyId: string;

  @IsEnum(ScanType)
  @IsOptional()
  scanType?: ScanType = ScanType.FULL;
}

export class UpdateFindingStatusDto {
  @IsUUID()
  findingId: string;

  @IsEnum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'FALSE_POSITIVE'])
  status: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class DomainValidationDto {
  @IsString()
  @IsNotEmpty()
  domain: string;
}

// Validation pipes personalizados
export const validateDomain = (domain: string): boolean => {
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9])*$/;
  return domainRegex.test(domain);
};

export const sanitizeDomain = (domain: string): string => {
  return domain.toLowerCase().trim();
};
