import { Resolver, Mutation, Args, Field, ObjectType } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { MercadopagoService } from './mercadopago.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { SubscriptionPlan } from '@prisma/client';

// GraphQL Types
@ObjectType()
class PaymentPreferenceResponse {
  @Field()
  preferenceId: string;

  @Field()
  initPoint: string;
}

@Resolver()
export class MercadopagoResolver {
  constructor(private readonly mercadopagoService: MercadopagoService) {}

  @Mutation(() => PaymentPreferenceResponse)
  @UseGuards(JwtAuthGuard)
  async createPaymentPreference(
    @CurrentUser() user: any,
    @Args('plan', { type: () => String }) plan: SubscriptionPlan,
    @Args('successUrl', { type: () => String, defaultValue: 'http://localhost:3000/payment/success' }) successUrl: string,
    @Args('failureUrl', { type: () => String, defaultValue: 'http://localhost:3000/payment/failure' }) failureUrl: string,
    @Args('pendingUrl', { type: () => String, defaultValue: 'http://localhost:3000/payment/pending' }) pendingUrl: string,
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
