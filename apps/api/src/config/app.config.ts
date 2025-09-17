import { IsString, IsNumber, IsBoolean, IsOptional, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';

export class AppConfig {
  @IsString()
  NODE_ENV: string = 'development';

  @IsNumber()
  @Type(() => Number)
  PORT: number = 3000;

  @IsUrl({ require_tld: false })
  DATABASE_URL: string;

  @IsString()
  JWT_SECRET: string;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  JWT_EXPIRES_IN: number = 3600; // 1 hora en segundos

  @IsUrl({ require_tld: false })
  @IsOptional()
  REDIS_URL: string = 'redis://localhost:6379';

  // Configuraciones de escaneo
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  SCAN_TIMEOUT: number = 300000; // 5 minutos en ms

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  MAX_CONCURRENT_SCANS: number = 5;

  @IsBoolean()
  @Type(() => Boolean)
  @IsOptional()
  ENABLE_SCAN_CACHING: boolean = true;

  // Rate limiting
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  RATE_LIMIT_MAX: number = 100;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  RATE_LIMIT_WINDOW: number = 15 * 60 * 1000; // 15 minutos

  // Logging
  @IsString()
  @IsOptional()
  LOG_LEVEL: string = 'info';

  @IsBoolean()
  @Type(() => Boolean)
  @IsOptional()
  ENABLE_DETAILED_LOGGING: boolean = false;
}

export const getConfig = (): AppConfig => {
  const config = new AppConfig();
  
  // Cargar desde variables de entorno
  Object.keys(config).forEach(key => {
    const envValue = process.env[key];
    if (envValue !== undefined) {
      // Conversión automática de tipos
      if (typeof config[key as keyof AppConfig] === 'number') {
        (config as any)[key] = parseInt(envValue, 10);
      } else if (typeof config[key as keyof AppConfig] === 'boolean') {
        (config as any)[key] = envValue.toLowerCase() === 'true';
      } else {
        (config as any)[key] = envValue;
      }
    }
  });

  return config;
};

// Validar configuración al iniciar la aplicación
export const validateConfig = (config: AppConfig): void => {
  const requiredFields = ['DATABASE_URL', 'JWT_SECRET'];
  
  for (const field of requiredFields) {
    if (!config[field as keyof AppConfig]) {
      throw new Error(`Missing required environment variable: ${field}`);
    }
  }

  if (config.NODE_ENV === 'production') {
    if (config.JWT_SECRET.length < 32) {
      throw new Error('JWT_SECRET must be at least 32 characters in production');
    }
  }
};
