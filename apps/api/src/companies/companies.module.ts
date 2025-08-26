import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesResolver } from './companies.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule, // Para acceso a la base de datos
  ],
  providers: [
    CompaniesService,  // Lógica de negocio
    CompaniesResolver, // GraphQL resolver
  ],
  exports: [
    CompaniesService,  // Exportar para uso en otros módulos
  ],
})
export class CompaniesModule {}
