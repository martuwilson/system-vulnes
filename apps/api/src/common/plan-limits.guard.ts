import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PrismaService } from '../prisma/prisma.service';
import { SubscriptionPlan, SubscriptionStatus } from '@prisma/client';

/**
 * Guard que valida límites del plan de suscripción antes de permitir escaneos
 * 
 * Lógica de límites:
 * - TRIAL: 1 empresa, 5 escaneos totales (para probar)
 * - STARTER: 1 empresa, escaneos ilimitados
 * - GROWTH: 3 empresas, escaneos ilimitados
 * - PRO: empresas ilimitadas, escaneos ilimitados
 */
@Injectable()
export class PlanLimitsGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    const user = request.user;

    if (!user || !user.id) {
      throw new HttpException(
        {
          message: 'Usuario no autenticado. Por favor, cerrá sesión y volvé a iniciar sesión.',
          code: 'UNAUTHORIZED',
        },
        HttpStatus.UNAUTHORIZED
      );
    }

    // Obtener suscripción del usuario
    const subscription = await this.prisma.subscription.findUnique({
      where: { userId: user.id },
    });

    // Si no tiene suscripción, asignar TRIAL por defecto
    const currentPlan = subscription?.plan || SubscriptionPlan.TRIAL;
    const isActive = subscription?.status === SubscriptionStatus.ACTIVE || currentPlan === SubscriptionPlan.TRIAL;

    if (!isActive) {
      throw new HttpException(
        {
          message: 'Tu suscripción no está activa',
          code: 'SUBSCRIPTION_INACTIVE',
          currentPlan,
          upgradeUrl: '/checkout',
        },
        HttpStatus.PAYMENT_REQUIRED,
      );
    }

    // Validar límite de escaneos (solo para TRIAL)
    // El límite de empresas se valida al crear empresas, no al escanear
    if (currentPlan === SubscriptionPlan.TRIAL) {
      const scanCount = await this.prisma.securityScan.count({
        where: {
          company: {
            userId: user.id,
          },
        },
      });

      const TRIAL_SCAN_LIMIT = 5;

      if (scanCount >= TRIAL_SCAN_LIMIT) {
        throw new HttpException(
          {
            message: `Alcanzaste el límite de ${TRIAL_SCAN_LIMIT} escaneos gratuitos`,
            code: 'SCAN_LIMIT_EXCEEDED',
            currentPlan: 'TRIAL',
            currentUsage: scanCount,
            limit: TRIAL_SCAN_LIMIT,
            upgradeUrl: '/checkout?plan=STARTER',
            availablePlans: [
              { plan: 'STARTER', price: 29, features: ['1 empresa', 'Escaneos ilimitados'] },
              { plan: 'GROWTH', price: 69, features: ['3 empresas', 'Escaneos ilimitados', 'Reportes PDF'] },
              { plan: 'PRO', price: 149, features: ['Empresas ilimitadas', 'Todo incluido'] },
            ],
          },
          HttpStatus.PAYMENT_REQUIRED,
        );
      }
    }

    return true;
  }
}
