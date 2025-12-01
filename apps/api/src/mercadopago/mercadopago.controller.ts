import { Controller, Post, Body, HttpCode, Headers } from '@nestjs/common';
import { MercadopagoService } from './mercadopago.service';

@Controller('mercadopago')
export class MercadopagoController {
  constructor(private mercadopagoService: MercadopagoService) {}

  /**
   * Webhook endpoint para notificaciones de MercadoPago
   */
  @Post('webhook')
  @HttpCode(200)
  async handleWebhook(
    @Body() body: any,
    @Headers('x-signature') signature: string,
    @Headers('x-request-id') requestId: string,
  ) {
    // TODO: Verificar firma del webhook para seguridad
    await this.mercadopagoService.handleWebhook(body);
    return { received: true };
  }
}
