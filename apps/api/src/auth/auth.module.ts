import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtStrategy } from './jwt.strategy';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    // Importar PrismaModule para acceso a la DB
    PrismaModule,
    
    // Configurar Passport
    PassportModule.register({ defaultStrategy: 'jwt' }),
    
    // Configurar JWT de forma asíncrona para usar variables de entorno
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN') || '15m',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,    // Servicio de autenticación
    AuthResolver,   // GraphQL resolver
    JwtStrategy,    // Estrategia JWT para Passport
  ],
  exports: [
    AuthService,    // Exportar para uso en otros módulos
    JwtStrategy,    // Exportar strategy
  ],
})
export class AuthModule {}
