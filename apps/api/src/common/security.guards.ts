import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CompanyOwnershipGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    const args = ctx.getArgs();
    
    const user = req.user;
    if (!user) {
      return false;
    }

    // Verificar acceso basado en el tipo de operación
    if (args.scanId) {
      return this.verifyScanAccess(user.id, args.scanId);
    }

    if (args.findingId) {
      return this.verifyFindingAccess(user.id, args.findingId);
    }

    if (args.assetId) {
      return this.verifyAssetAccess(user.id, args.assetId);
    }

    return true; // Por defecto permitir si no hay recursos específicos
  }

  private async verifyScanAccess(userId: string, scanId: string): Promise<boolean> {
    try {
      const scan = await this.prisma.securityScan.findFirst({
        where: {
          id: scanId,
          company: {
            users: {
              some: {
                id: userId,
              },
            },
          },
        },
      });

      return !!scan;
    } catch (error) {
      return false;
    }
  }

  private async verifyFindingAccess(userId: string, findingId: string): Promise<boolean> {
    try {
      const finding = await this.prisma.finding.findFirst({
        where: {
          id: findingId,
          scan: {
            company: {
              users: {
                some: {
                  id: userId,
                },
              },
            },
          },
        },
      });

      return !!finding;
    } catch (error) {
      return false;
    }
  }

  private async verifyAssetAccess(userId: string, assetId: string): Promise<boolean> {
    try {
      const asset = await this.prisma.asset.findFirst({
        where: {
          id: assetId,
          company: {
            users: {
              some: {
                id: userId,
              },
            },
          },
        },
      });

      return !!asset;
    } catch (error) {
      return false;
    }
  }
}

// Guard para verificar roles específicos
@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private prisma: PrismaService,
    private requiredRoles: string[]
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    
    const user = req.user;
    if (!user) {
      return false;
    }

    // Obtener roles del usuario
    const userWithRoles = await this.prisma.user.findUnique({
      where: { id: user.id },
      select: {
        role: true,
        companyId: true,
      },
    });

    if (!userWithRoles) {
      return false;
    }

    // Verificar si tiene alguno de los roles requeridos
    return this.requiredRoles.includes(userWithRoles.role);
  }
}

// Utilidades de seguridad
export class SecurityUtils {
  static sanitizeInput(input: string): string {
    return input
      .replace(/[<>'"]/g, '') // Remover caracteres peligrosos
      .trim()
      .substring(0, 1000); // Limitar longitud
  }

  static isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  static maskSensitiveData(data: any): any {
    const sensitiveFields = ['password', 'token', 'secret', 'key'];
    
    if (typeof data === 'object' && data !== null) {
      const masked = { ...data };
      
      for (const field of sensitiveFields) {
        if (field in masked) {
          masked[field] = '***MASKED***';
        }
      }
      
      return masked;
    }
    
    return data;
  }
}
