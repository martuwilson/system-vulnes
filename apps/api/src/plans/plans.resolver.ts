import { Resolver, Query, Args } from '@nestjs/graphql';
import { PrismaService } from '../prisma/prisma.service';
import { PlanLimits } from '../graphql/models';

@Resolver(() => PlanLimits)
export class PlansResolver {
  constructor(private prisma: PrismaService) {}

  /**
   * Obtener todos los límites de planes disponibles
   * No requiere autenticación (información pública)
   */
  @Query(() => [PlanLimits])
  async planLimits(): Promise<PlanLimits[]> {
    return this.prisma.planLimits.findMany({
      orderBy: {
        priceUsd: 'asc', // Ordenar por precio ascendente
      },
    }) as any;
  }

  /**
   * Obtener límites de un plan específico
   * No requiere autenticación (información pública)
   */
  @Query(() => PlanLimits, { nullable: true })
  async planLimitsByPlan(@Args('plan') plan: string): Promise<PlanLimits | null> {
    return this.prisma.planLimits.findUnique({
      where: { plan: plan as any },
    }) as any;
  }
}
