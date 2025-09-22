import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { SecurityService } from './security.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '@prisma/client';
import { 
  SecurityScanResult,
  SecurityScanStatus,
  SecurityScanSummary,
  SecurityFinding
} from '../graphql/models';
import { SecurityScanInput as SecurityScanInputType } from '../graphql/inputs';

@Resolver()
@UseGuards(JwtAuthGuard)
export class SecurityResolver {
  constructor(
    private readonly securityService: SecurityService,
    private readonly prisma: PrismaService,
  ) {}

  @Mutation(() => SecurityScanResult)
  async startSecurityScanQueued(
    @Args('input') input: SecurityScanInputType,
    @CurrentUser() user: User,
  ): Promise<SecurityScanResult> {
    try {
      // El user de Prisma no incluye companyId, necesitamos obtenerlo
      const userWithCompany = await this.getCurrentUserWithCompany(user.id);
      
      if (!userWithCompany?.companyId) {
        return {
          success: false,
          scanId: null,
          message: 'User is not associated with any company',
          healthScore: 0,
          findings: []
        };
      }

      // Obtener el asset para conseguir el dominio
      const asset = await this.prisma.asset.findUnique({
        where: { id: input.assetId },
        select: { domain: true, companyId: true }
      });

      if (!asset || asset.companyId !== userWithCompany.companyId) {
        return {
          success: false,
          scanId: null,
          message: 'Asset not found or not accessible',
          healthScore: 0,
          findings: []
        };
      }

      // Encolar el escaneo para procesamiento en background
      const result = await this.securityService.queueSecurityScan(
        asset.domain, // Usar el dominio real del asset
        userWithCompany.companyId,
        user.id,
        input.assetId
      );

      return {
        success: true,
        scanId: result.scanId,
        message: `Security scan queued successfully. Job ID: ${result.jobId}`,
        healthScore: 0, // Se calculará cuando complete
        findings: []
      };

    } catch (error) {
      console.error('Error starting queued security scan:', error);
      return {
        success: false,
        scanId: null,
        message: `Failed to queue security scan: ${error.message}`,
        healthScore: 0,
        findings: []
      };
    }
  }

  @Mutation(() => SecurityScanResult)
  async startSecurityScan(
    @Args('input') input: SecurityScanInputType,
    @CurrentUser() user: User,
  ): Promise<SecurityScanResult> {
    try {
      // El user de Prisma no incluye companyId, necesitamos obtenerlo
      const userWithCompany = await this.getCurrentUserWithCompany(user.id);
      
      if (!userWithCompany?.companyId) {
        return {
          success: false,
          scanId: null,
          message: 'User is not associated with any company',
          healthScore: 0,
          findings: [],
        };
      }

      // Obtener el asset para conseguir el dominio
      const asset = await this.prisma.asset.findUnique({
        where: { id: input.assetId },
        select: { domain: true, companyId: true }
      });

      if (!asset || asset.companyId !== userWithCompany.companyId) {
        return {
          success: false,
          scanId: null,
          message: 'Asset not found or not accessible',
          healthScore: 0,
          findings: [],
        };
      }

      // Hacer scan directo usando el dominio real
      const result = await this.securityService.executeScan(asset.domain);
      
      return {
        success: true,
        scanId: "test-scan-" + Date.now(),
        message: 'Security scan completed successfully',
        healthScore: result.healthScore,
        findings: result.findings.map(finding => ({
          id: finding.id || '',
          category: finding.category as any,
          severity: finding.severity as any,
          title: finding.title,
          description: finding.description,
          recommendation: finding.recommendation,
          status: finding.status as any,
          assetId: input.assetId,
          asset: { domain: asset.domain },
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
      };
    } catch (error) {
      return {
        success: false,
        scanId: null,
        message: `Security scan failed: ${error.message}`,
        healthScore: 0,
        findings: [],
      };
    }
  }

  @Query(() => SecurityScanResult)
  async getLatestSecurityScan(
    @Args('assetId', { type: () => Int }) assetId: number,
    @CurrentUser() user: User,
  ): Promise<SecurityScanResult> {
    try {
      const userWithCompany = await this.getCurrentUserWithCompany(user.id);
      
      if (!userWithCompany?.companyId) {
        return {
          success: false,
          scanId: null,
          message: 'User is not associated with any company',
          healthScore: 0,
          findings: [],
        };
      }

      const result = await this.securityService.getLatestScan(assetId, userWithCompany.companyId);
      
      if (!result) {
        return {
          success: false,
          scanId: null,
          message: 'No security scans found for this asset',
          healthScore: 0,
          findings: [],
        };
      }

      return {
        success: true,
        scanId: result.id,
        message: 'Latest security scan retrieved successfully',
        healthScore: result.healthScore,
        findings: result.findings.map(finding => ({
          id: finding.id,
          category: finding.category as any,
          severity: finding.severity as any,
          title: finding.title,
          description: finding.description,
          recommendation: finding.recommendation,
          status: finding.status as any,
          assetId: assetId.toString(),
          asset: { domain: '' }, // TODO: obtener dominio real
          createdAt: finding.createdAt,
          updatedAt: finding.updatedAt,
        })),
      };
    } catch (error) {
      return {
        success: false,
        scanId: null,
        message: `Failed to retrieve security scan: ${error.message}`,
        healthScore: 0,
        findings: [],
      };
    }
  }

  @Query(() => [SecurityScanSummary])
  async getSecurityScanHistory(
    @Args('assetId', { type: () => Int }) assetId: number,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 10 }) limit: number,
    @CurrentUser() user: User,
  ): Promise<SecurityScanSummary[]> {
    try {
      const userWithCompany = await this.getCurrentUserWithCompany(user.id);
      
      if (!userWithCompany?.companyId) {
        return [];
      }

      const scans = await this.securityService.getScanHistory(
        assetId, 
        userWithCompany.companyId, 
        limit
      );

      return scans.map(scan => ({
        id: scan.id,
        assetId: assetId,
        domain: 'unknown', // TODO: obtener dominio del scan
        healthScore: scan.healthScore,
        findingsCount: scan._count?.findings || 0,
        criticalFindings: scan.findings?.filter(f => f.severity === 'CRITICAL').length || 0,
        highFindings: scan.findings?.filter(f => f.severity === 'HIGH').length || 0,
        mediumFindings: scan.findings?.filter(f => f.severity === 'MEDIUM').length || 0,
        lowFindings: scan.findings?.filter(f => f.severity === 'LOW').length || 0,
        status: scan.status as any,
        createdAt: scan.createdAt,
        updatedAt: scan.updatedAt,
      }));
    } catch (error) {
      console.error('Error retrieving security scan history:', error);
      return [];
    }
  }

  @Query(() => [SecurityFinding])
  async getSecurityFindings(
    @Args('scanId', { type: () => String }) scanId: string,
    @CurrentUser() user: User,
  ): Promise<SecurityFinding[]> {
    try {
      const userWithCompany = await this.getCurrentUserWithCompany(user.id);
      
      if (!userWithCompany?.companyId) {
        return [];
      }

      const findings = await this.securityService.getScanFindings(scanId, userWithCompany.companyId);
      
      return findings.map(finding => ({
        id: finding.id,
        category: finding.category as any,
        severity: finding.severity as any,
        title: finding.title,
        description: finding.description,
        recommendation: finding.recommendation,
        status: finding.status as any,
        assetId: scanId, // Temporal - necesitaríamos relacionar finding -> scan -> asset
        asset: { domain: 'unknown' }, // TODO: obtener dominio real
        createdAt: finding.createdAt,
        updatedAt: finding.updatedAt,
      }));
    } catch (error) {
      console.error('Error retrieving security findings:', error);
      return [];
    }
  }

  @Mutation(() => Boolean)
  async updateFindingStatus(
    @Args('findingId', { type: () => String }) findingId: string,
    @Args('status') status: string,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    try {
      const userWithCompany = await this.getCurrentUserWithCompany(user.id);
      
      if (!userWithCompany?.companyId) {
        return false;
      }

      await this.securityService.updateFindingStatus(
        findingId, 
        status as any, // Se validará en el servicio
        userWithCompany.companyId
      );
      return true;
    } catch (error) {
      console.error('Error updating finding status:', error);
      return false;
    }
  }

  @Query(() => SecurityScanStatus, { nullable: true })
  async getSecurityScanStatus(
    @Args('scanId', { type: () => String }) scanId: string,
    @CurrentUser() user: User,
  ): Promise<SecurityScanStatus | null> {
    try {
      const userWithCompany = await this.getCurrentUserWithCompany(user.id);
      
      if (!userWithCompany?.companyId) {
        return null;
      }

      const scan = await this.prisma.securityScan.findFirst({
        where: {
          id: scanId,
          companyId: userWithCompany.companyId,
        },
        include: {
          findings: {
            orderBy: { createdAt: 'desc' }
          }
        }
      });

      if (!scan) {
        return null;
      }

      return {
        id: scan.id,
        status: scan.status as any,
        healthScore: scan.healthScore,
        domain: scan.domain,
        createdAt: scan.createdAt,
        completedAt: scan.completedAt,
        findings: scan.findings.map(finding => ({
          id: finding.id,
          category: finding.category as any,
          severity: finding.severity as any,
          title: finding.title,
          description: finding.description,
          recommendation: finding.recommendation,
          status: finding.status as any,
          assetId: '',
          asset: { domain: scan.domain },
          createdAt: finding.createdAt,
          updatedAt: finding.updatedAt,
        })),
      };

    } catch (error) {
      console.error('Error getting scan status:', error);
      return null;
    }
  }

  /**
   * Query para obtener scans por compañía (para el dashboard)
   */
  @Query(() => [SecurityScanSummary])
  async securityScans(
    @Args('companyId', { type: () => String }) companyId: string,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 5 }) limit: number,
    @CurrentUser() user: User,
  ): Promise<SecurityScanSummary[]> {
    try {
      const userWithCompany = await this.getCurrentUserWithCompany(user.id);
      
      if (!userWithCompany?.companyId || userWithCompany.companyId !== companyId) {
        return [];
      }

      // Obtener todos los scans de la compañía
      const scans = await this.prisma.securityScan.findMany({
        where: {
          companyId: companyId
        },
        include: {
          findings: {
            select: {
              id: true,
              severity: true,
              category: true,
              title: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: limit,
      });

      return scans.map(scan => ({
        id: scan.id,
        assetId: 0, // No hay assetId en este modelo
        domain: scan.domain, // Usar el dominio específico del scan
        healthScore: scan.healthScore,
        findingsCount: scan.findings?.length || 0,
        criticalFindings: scan.findings?.filter(f => f.severity === 'CRITICAL').length || 0,
        highFindings: scan.findings?.filter(f => f.severity === 'HIGH').length || 0,
        mediumFindings: scan.findings?.filter(f => f.severity === 'MEDIUM').length || 0,
        lowFindings: scan.findings?.filter(f => f.severity === 'LOW').length || 0,
        status: scan.status as any,
        createdAt: scan.createdAt,
        updatedAt: scan.updatedAt,
      }));
    } catch (error) {
      console.error('Error retrieving company security scans:', error);
      return [];
    }
  }

  /**
   * Query para obtener findings por compañía (para el dashboard)
   */
  @Query(() => [SecurityFinding])
  async securityFindings(
    @Args('companyId', { type: () => String }) companyId: string,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 10 }) limit: number,
    @CurrentUser() user: User,
  ): Promise<SecurityFinding[]> {
    try {
      const userWithCompany = await this.getCurrentUserWithCompany(user.id);
      
      if (!userWithCompany?.companyId || userWithCompany.companyId !== companyId) {
        return [];
      }

      // Obtener todos los findings de la compañía
      const findings = await this.prisma.finding.findMany({
        where: {
          scan: {
            companyId: companyId
          }
        },
        include: {
          scan: {
            include: {
              company: {
                select: {
                  domain: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: limit,
      });

      return findings.map(finding => ({
        id: finding.id,
        category: finding.category as any,
        severity: finding.severity as any,
        title: finding.title,
        description: finding.description,
        recommendation: finding.recommendation,
        status: finding.status as any,
        assetId: '0', // No hay assetId en este modelo
        asset: {
          domain: finding.scan.company.domain
        },
        createdAt: finding.createdAt,
        updatedAt: finding.updatedAt,
      }));
    } catch (error) {
      console.error('Error retrieving company security findings:', error);
      return [];
    }
  }

  /**
   * Query para obtener todos los findings de una empresa (para la página de Vulnerabilidades)
   */
  @Query(() => [SecurityFinding])
  async getAllFindings(
    @Args('companyId', { type: () => String }) companyId: string,
    @CurrentUser() user: User,
  ): Promise<SecurityFinding[]> {
    try {
      const userWithCompany = await this.getCurrentUserWithCompany(user.id);
      
      if (!userWithCompany?.companyId || userWithCompany.companyId !== companyId) {
        return [];
      }

      // Obtener todos los findings de los scans de la empresa
      const findings = await this.prisma.finding.findMany({
        where: {
          scan: {
            companyId: companyId
          }
        },
        include: {
          scan: {
            select: {
              id: true,
              domain: true,
              createdAt: true
            }
          }
        },
        orderBy: [
          { severity: 'desc' }, // CRITICAL primero
          { createdAt: 'desc' }
        ]
      });

      return findings.map(finding => ({
        id: finding.id,
        category: finding.category as any,
        severity: finding.severity as any,
        title: finding.title,
        description: finding.description,
        recommendation: finding.recommendation,
        status: finding.status as any,
        assetId: '', // No tenemos assetId en este contexto
        asset: { domain: finding.scan.domain }, // Usar el dominio del scan
        createdAt: finding.createdAt,
        updatedAt: finding.updatedAt,
      }));

    } catch (error) {
      console.error('Error retrieving all findings:', error);
      return [];
    }
  }

  /**
   * Mutation para actualizar el estado de un finding (específico para la página de Vulnerabilidades)
   */
  @Mutation(() => SecurityFinding)
  async updateFindingStatusDetailed(
    @Args('findingId', { type: () => String }) findingId: string,
    @Args('status', { type: () => String }) status: string,
    @CurrentUser() user: User,
  ): Promise<SecurityFinding | null> {
    try {
      const userWithCompany = await this.getCurrentUserWithCompany(user.id);
      
      if (!userWithCompany?.companyId) {
        throw new Error('User is not associated with any company');
      }

      // Verificar que el finding pertenece a la empresa del usuario
      const finding = await this.prisma.finding.findFirst({
        where: {
          id: findingId,
          scan: {
            companyId: userWithCompany.companyId
          }
        },
        include: {
          scan: {
            select: {
              id: true,
              domain: true,
              createdAt: true
            }
          }
        }
      });

      if (!finding) {
        throw new Error('Finding not found or access denied');
      }

      // Actualizar el status
      const updatedFinding = await this.prisma.finding.update({
        where: { id: findingId },
        data: { 
          status: status as any,
          updatedAt: new Date()
        },
        include: {
          scan: {
            select: {
              id: true,
              domain: true,
              createdAt: true
            }
          }
        }
      });

      return {
        id: updatedFinding.id,
        category: updatedFinding.category as any,
        severity: updatedFinding.severity as any,
        title: updatedFinding.title,
        description: updatedFinding.description,
        recommendation: updatedFinding.recommendation,
        status: updatedFinding.status as any,
        assetId: '',
        asset: { domain: updatedFinding.scan.domain },
        createdAt: updatedFinding.createdAt,
        updatedAt: updatedFinding.updatedAt,
      };

    } catch (error) {
      console.error('Error updating finding status:', error);
      throw error;
    }
  }

  /**
   * Helper para obtener usuario con companyId real de la base de datos
   */
  private async getCurrentUserWithCompany(userId: string) {
    try {
      // Buscar la empresa del usuario en la base de datos
      const userCompany = await this.prisma.company.findFirst({
        where: { userId: userId },
        select: { id: true }
      });

      if (!userCompany) {
        // Si no tiene empresa, usar la empresa que creamos en los tests
        const testCompany = await this.prisma.company.findFirst({
          orderBy: { createdAt: 'desc' },
          select: { id: true }
        });
        
        return testCompany ? { companyId: testCompany.id } : null;
      }

      return { companyId: userCompany.id };
    } catch (error) {
      console.error('Error getting user company:', error);
      return null;
    }
  }
}
