import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import { PrismaService } from '../prisma/prisma.service';
import { SubscriptionPlan, SubscriptionStatus } from '@prisma/client';

@Injectable()
export class MercadopagoService {
  private client: MercadoPagoConfig;
  private readonly logger = new Logger(MercadopagoService.name);

  // Precios en USD
  private readonly pricesUSD = {
    STARTER: 29,
    GROWTH: 69,
    PRO: 149,
  };

  private readonly usdToArs: number;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    // Obtener tipo de cambio USD → ARS desde .env
    this.usdToArs = parseFloat(this.configService.get<string>('USD_TO_ARS_RATE') || '1480');
    this.logger.log(`💵 Tipo de cambio USD/ARS: $${this.usdToArs}`);

    const accessToken = this.configService.get<string>('MERCADOPAGO_ACCESS_TOKEN');
    
    if (!accessToken || accessToken === 'your_mercadopago_access_token') {
      this.logger.warn('⚠️ MERCADOPAGO_ACCESS_TOKEN not configured. MercadoPago functionality will be disabled.');
      return;
    }

    this.client = new MercadoPagoConfig({ 
      accessToken,
      options: { timeout: 5000 }
    });

    this.logger.log('✅ MercadoPago initialized successfully');
  }

  /**
   * Crear preferencia de pago (equivalente al checkout de Stripe)
   */
  async createPreference(
    userId: string,
    plan: SubscriptionPlan,
    successUrl: string,
    failureUrl: string,
    pendingUrl: string,
  ): Promise<{ id: string; initPoint: string }> {
    this.logger.log(`Creating payment preference for user ${userId}, plan ${plan}`);

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const priceUSD = this.pricesUSD[plan];
    if (!priceUSD) {
      throw new Error(`No price configured for plan ${plan}`);
    }

    // Convertir USD → ARS
    const priceARS = Math.round(priceUSD * this.usdToArs);
    this.logger.log(`💰 Plan ${plan}: $${priceUSD} USD → $${priceARS.toLocaleString('es-AR')} ARS (tasa: $${this.usdToArs})`);

    const price = priceARS;

    const preference = new Preference(this.client);

    const result = await preference.create({
      body: {
        items: [
          {
            id: `plan-${plan.toLowerCase()}`,
            title: `Plan ${plan} - Securyx PyME`,
            description: `Suscripción mensual al plan ${plan}`,
            quantity: 1,
            unit_price: price,
            currency_id: 'ARS',
          },
        ],
        payer: {
          email: user.email,
          name: user.firstName,
          surname: user.lastName || '',
        },
        back_urls: {
          success: successUrl,
          failure: failureUrl,
          pending: pendingUrl,
        },
        auto_return: 'approved',
        external_reference: userId,
        notification_url: `${this.configService.get('APP_URL')}/mercadopago/webhook`,
        metadata: {
          userId,
          plan,
        },
        statement_descriptor: 'SECURYX PYME',
      },
    });

    this.logger.log(`Payment preference created: ${result.id}`);

    return {
      id: result.id!,
      initPoint: result.init_point!,
    };
  }

  /**
   * Manejar webhook de MercadoPago
   */
  async handleWebhook(body: any): Promise<void> {
    this.logger.log(`Processing webhook: ${body.type}`);

    // Verificar que sea una notificación de pago
    if (body.type === 'payment') {
      const paymentId = body.data.id;
      await this.handlePaymentNotification(paymentId);
    }
  }

  /**
   * Procesar notificación de pago
   */
  private async handlePaymentNotification(paymentId: string): Promise<void> {
    try {
      const payment = new Payment(this.client);
      const result = await payment.get({ id: paymentId });

      this.logger.log(`Payment ${paymentId} status: ${result.status}`);

      if (result.status === 'approved') {
        const userId = result.external_reference;
        const plan = result.metadata?.plan as SubscriptionPlan;

        if (!userId || !plan) {
          this.logger.error('Missing metadata in payment');
          return;
        }

        // Activar suscripción
        const now = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1); // 30 días

        await this.prisma.subscription.upsert({
          where: { userId },
          update: {
            plan,
            status: SubscriptionStatus.ACTIVE,
            mercadopagoPaymentId: paymentId,
            currentPeriodStart: now,
            currentPeriodEnd: endDate,
          },
          create: {
            userId,
            plan,
            status: SubscriptionStatus.ACTIVE,
            mercadopagoPaymentId: paymentId,
            currentPeriodStart: now,
            currentPeriodEnd: endDate,
          },
        });

        this.logger.log(`✅ Subscription activated for user ${userId}, plan ${plan}`);
      } else if (result.status === 'rejected') {
        this.logger.warn(`Payment ${paymentId} was rejected`);
      } else {
        this.logger.log(`Payment ${paymentId} is ${result.status}`);
      }
    } catch (error) {
      this.logger.error(`Error processing payment ${paymentId}:`, error);
      throw error;
    }
  }

  /**
   * Verificar estado de pago
   */
  async checkPaymentStatus(paymentId: string): Promise<string> {
    const payment = new Payment(this.client);
    const result = await payment.get({ id: paymentId });
    return result.status || 'unknown';
  }
}
