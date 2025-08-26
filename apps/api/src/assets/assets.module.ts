import { Module } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { AssetsResolver } from './assets.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { CompaniesModule } from '../companies/companies.module';

@Module({
  imports: [
    PrismaModule,     // Para acceso a la base de datos
    CompaniesModule,  // Para verificar permisos de empresa
  ],
  providers: [
    AssetsService,    // Lógica de negocio
    AssetsResolver,   // GraphQL resolver
  ],
  exports: [
    AssetsService,    // Exportar para uso en otros módulos
  ],
})
export class AssetsModule {}
