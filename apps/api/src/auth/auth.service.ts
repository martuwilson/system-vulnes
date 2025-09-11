import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterInput, LoginInput } from '../graphql/inputs';
import { AuthResponse } from '../graphql/responses';
import { User } from '../graphql/models';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * Registra un nuevo usuario
   */
  async register(input: RegisterInput): Promise<AuthResponse> {
    // Verificar si el usuario ya existe
    const existingUser = await this.prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existingUser) {
      throw new ConflictException('El usuario ya existe con este email');
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(input.password, 12);

    // Crear el usuario y la empresa en una transacción
    const result = await this.prisma.$transaction(async (prisma) => {
      // Crear el usuario
      const user = await prisma.user.create({
        data: {
          email: input.email,
          password: hashedPassword,
          firstName: input.name.split(' ')[0] || input.name,
          lastName: input.name.split(' ').slice(1).join(' ') || '',
        },
      });

      // Crear la empresa
      const company = await prisma.company.create({
        data: {
          name: input.companyName,
          domain: input.companyDomain,
          userId: user.id,
        },
      });

      // Crear la relación CompanyUser
      await prisma.companyUser.create({
        data: {
          userId: user.id,
          companyId: company.id,
          role: 'OWNER',
        },
      });

      // Crear suscripción trial automática
      await prisma.subscription.create({
        data: {
          userId: user.id,
          plan: 'TRIAL',
          status: 'TRIALING',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 días
        },
      });

      return { user, company };
    });

    // Generar tokens
    const tokens = await this.generateTokens(result.user.id, result.user.email);

    return {
      ...tokens,
      user: result.user as any,
    };
  }

  /**
   * Hacer login de usuario
   */
  async login(input: LoginInput): Promise<AuthResponse> {
    // Buscar usuario
    const user = await this.prisma.user.findUnique({
      where: { email: input.email },
      include: {
        subscription: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(input.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Generar tokens
    const tokens = await this.generateTokens(user.id, user.email);

    return {
      ...tokens,
      user: user as any,
    };
  }

  /**
   * Renovar access token usando refresh token
   */
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      // Verificar refresh token
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      // Buscar usuario
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        include: {
          subscription: true,
        },
      });

      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      // Generar nuevos tokens
      const tokens = await this.generateTokens(user.id, user.email);

      return {
        ...tokens,
        user: user as any,
      };
    } catch (error) {
      throw new UnauthorizedException('Refresh token inválido');
    }
  }

  /**
   * Validar usuario por ID (usado por JWT Strategy)
   */
  async validateUser(userId: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        companies: true,
        subscription: true,
      },
    });

    return user as any;
  }

  /**
   * Generar access token y refresh token
   */
  private async generateTokens(userId: string, email: string) {
    const payload = { email, sub: userId };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRES_IN') || '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN') || '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
