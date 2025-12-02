import { Controller, Post, Body, Logger } from '@nestjs/common';
import { MercadopagoService } from './mercadopago.service';

@Controller('mercadopago')
export class MercadopagoController {
  private readonly logger = new Logger(MercadopagoController.name);

  constructor(private readonly mercadopagoService: MercadopagoService) {}

  /**
   * Webhook de MercadoPago para recibir notificaciones de pago
   */
  @Post('webhook')
  async handleWebhook(@Body() body: any) {
    this.logger.log('Received MercadoPago webhook');
    
    try {
      await this.mercadopagoService.handleWebhook(body);
      return { success: true };
    } catch (error) {
      this.logger.error('Error processing webhook:', error);
      throw error;
    }
  }
}
