import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { MercadopagoService } from './mercadopago.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { SubscriptionPlan } from '@prisma/client';

@Resolver()
export class MercadopagoResolver {
  constructor(private readonly mercadopagoService: MercadopagoService) {}

  @Mutation(() => PaymentPreferenceResponse)
  @UseGuards(JwtAuthGuard)
  async createPaymentPreference(
    @CurrentUser() user: any,
    @Args('plan') plan: SubscriptionPlan,
    @Args('successUrl', { defaultValue: 'http://localhost:3000/payment/success' }) successUrl: string,
    @Args('failureUrl', { defaultValue: 'http://localhost:3000/payment/failure' }) failureUrl: string,
    @Args('pendingUrl', { defaultValue: 'http://localhost:3000/payment/pending' }) pendingUrl: string,
  ): Promise<PaymentPreferenceResponse> {
    const result = await this.mercadopagoService.createPreference(
      user.userId,
      plan,
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

// GraphQL Types
class PaymentPreferenceResponse {
  preferenceId: string;
  initPoint: string;
}
