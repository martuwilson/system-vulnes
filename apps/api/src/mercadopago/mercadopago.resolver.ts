import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { MercadopagoService } from './mercadopago.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../graphql/models';
import { SubscriptionPlan } from '@prisma/client';

@Resolver()
export class MercadopagoResolver {
  constructor(private mercadopagoService: MercadopagoService) {}

  /**
   * Crear preferencia de pago
   */
  @Mutation(() => PaymentPreferenceResponse)
  @UseGuards(JwtAuthGuard)
  async createPaymentPreference(
    @CurrentUser() user: User,
    @Args('plan', { type: () => String }) plan: string,
  ): Promise<PaymentPreferenceResponse> {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const successUrl = `${frontendUrl}/app/dashboard?payment=success`;
    const failureUrl = `${frontendUrl}/pricing?payment=failure`;
    const pendingUrl = `${frontendUrl}/app/dashboard?payment=pending`;

    const result = await this.mercadopagoService.createPreference(
      user.id,
      plan as SubscriptionPlan,
      successUrl,
      failureUrl,
      pendingUrl,
    );

    return {
      preferenceId: result.id,
      initPoint: result.initPoint,
    };
  }
}

// Response type
class PaymentPreferenceResponse {
  preferenceId: string;
  initPoint: string;
}
