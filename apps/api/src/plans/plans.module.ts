import { Module } from '@nestjs/common';
import { PlansResolver } from './plans.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [PlansResolver],
  exports: [PlansResolver],
})
export class PlansModule {}
