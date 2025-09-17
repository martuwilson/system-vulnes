import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { SetMetadata } from '@nestjs/common';

export const RATE_LIMIT_KEY = 'rateLimit';
export const RateLimit = (maxRequests: number, windowMs: number) =>
  SetMetadata(RATE_LIMIT_KEY, { maxRequests, windowMs });

@Injectable()
export class RateLimitGuard implements CanActivate {
  private requestCounts = new Map<string, { count: number; resetTime: number }>();

  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rateLimitOptions = this.reflector.getAllAndOverride(RATE_LIMIT_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!rateLimitOptions) {
      return true; // No rate limit configured
    }

    const { maxRequests, windowMs } = rateLimitOptions;
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    
    // Identificar usuario (IP + userId si está autenticado)
    const identifier = this.getIdentifier(req);
    const now = Date.now();
    
    // Limpiar registros expirados
    this.cleanExpiredRecords(now);
    
    const record = this.requestCounts.get(identifier);
    
    if (!record || now > record.resetTime) {
      // Nuevo período de tiempo
      this.requestCounts.set(identifier, {
        count: 1,
        resetTime: now + windowMs,
      });
      return true;
    }
    
    if (record.count >= maxRequests) {
      return false; // Rate limit excedido
    }
    
    record.count++;
    return true;
  }

  private getIdentifier(req: any): string {
    const ip = req.ip || req.connection.remoteAddress;
    const userId = req.user?.id;
    return userId ? `user:${userId}` : `ip:${ip}`;
  }

  private cleanExpiredRecords(now: number) {
    for (const [key, record] of this.requestCounts.entries()) {
      if (now > record.resetTime) {
        this.requestCounts.delete(key);
      }
    }
  }
}

// Decoradores para diferentes tipos de operaciones
export const ScanRateLimit = () => RateLimit(10, 60 * 1000); // 10 scans por minuto
export const AuthRateLimit = () => RateLimit(5, 15 * 60 * 1000); // 5 intentos por 15 min
export const ApiRateLimit = () => RateLimit(100, 60 * 1000); // 100 requests por minuto
