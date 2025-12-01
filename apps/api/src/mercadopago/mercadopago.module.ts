import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MercadopagoService } from './mercadopago.service';
import { MercadopagoController } from './mercadopago.controller';
import { MercadopagoResolver } from './mercadopago.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [ConfigModule, PrismaModule],
  controllers: [MercadopagoController],
  providers: [MercadopagoService, MercadopagoResolver],
  exports: [MercadopagoService],
})
export class MercadopagoModule {}
