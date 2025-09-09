import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { SecurityService } from './security.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '@prisma/client';
import { 
  SecurityScanResult,
  SecurityScanSummary,
  SecurityFinding
} from '../graphql/models';
import { SecurityScanInput as SecurityScanInputType } from '../graphql/inputs';

@Resolver()
@UseGuards(JwtAuthGuard)
export class SecurityResolver {
  constructor(private readonly securityService: SecurityService) {}

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

      // Por ahora hacemos scan directo para pruebas
      const result = await this.securityService.executeScan("google.com");
      
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
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
      };

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

  /**
   * Helper para obtener usuario con companyId
   */
  private async getCurrentUserWithCompany(userId: string) {
    // Por ahora simulamos que el usuario tiene una empresa
    // En una implementación real, esto vendría de una tabla de relación usuario-empresa
    return {
      companyId: `company-${userId}` // Temporal
    };
  }
}
