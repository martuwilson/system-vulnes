import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { PrismaService } from '../prisma/prisma.service';
import { ScanStatus, FindingCategory, Severity, FindingStatus } from '@prisma/client';
import { EmailSecurityScanner } from './scanners/email-security.scanner';
import { SSLCertificateScanner } from './scanners/ssl-certificate.scanner';
import { SecurityHeadersScanner } from './scanners/security-headers.scanner';
import { PortScanner } from './scanners/port.scanner';
import { SecurityScanJob } from './security.processor';

@Injectable()
export class SecurityService {
  private readonly logger = new Logger(SecurityService.name);

  constructor(
    @InjectQueue('security-scan') private securityQueue: Queue,
    private prisma: PrismaService,
    private emailScanner: EmailSecurityScanner,
    private sslScanner: SSLCertificateScanner,
    private headersScanner: SecurityHeadersScanner,
    private portScanner: PortScanner,
  ) {}

  /**
   * Encolar un escaneo de seguridad para procesamiento en background
   */
  async queueSecurityScan(
    domain: string,
    companyId: string,
    userId: string,
    assetId?: string
  ): Promise<{ scanId: string; jobId: string }> {
    const scanId = `security-scan-${Date.now()}`;

    this.logger.log(`Queuing security scan for domain: ${domain}, scanId: ${scanId}`);

    try {
      // Crear el job data
      const jobData: SecurityScanJob = {
        scanId,
        domain,
        assetId: assetId || '',
        companyId,
        userId,
      };

      // Encolar el trabajo
      const job = await this.securityQueue.add('execute-scan', jobData, {
        delay: 0,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
      });

      this.logger.log(`Security scan job queued: ${job.id} for domain: ${domain}`);

      return {
        scanId,
        jobId: job.id?.toString() || 'unknown',
      };

    } catch (error) {
      this.logger.error(`Failed to queue security scan for ${domain}:`, error);
      throw error;
    }
  }

  /**
   * Obtener el estado de un escaneo
   */
  async getScanStatus(scanId: string) {
    try {
      const scan = await this.prisma.securityScan.findUnique({
        where: { id: scanId },
        include: {
          findings: true,
        },
      });

      if (!scan) {
        return null;
      }

      return {
        id: scan.id,
        status: scan.status,
        healthScore: scan.healthScore,
        startedAt: scan.startedAt,
        completedAt: scan.completedAt,
        findingsCount: scan.findings.length,
        findings: scan.findings.map(finding => ({
          id: finding.id,
          category: finding.category,
          severity: finding.severity,
          title: finding.title,
          description: finding.description,
          recommendation: finding.recommendation,
          status: finding.status,
          createdAt: finding.createdAt,
        })),
      };

    } catch (error) {
      this.logger.error(`Failed to get scan status for ${scanId}:`, error);
      throw error;
    }
  }

  /**
   * Iniciar un escaneo completo de seguridad para una empresa
   */
  async startScan(companyId: string): Promise<string> {
    this.logger.log(`Starting security scan for company: ${companyId}`);

    try {
      // Verificar que la empresa existe y obtener assets activos
      const company = await this.prisma.company.findUnique({
        where: { id: companyId },
        include: {
          assets: {
            where: { isActive: true }
          }
        }
      });

      if (!company) {
        throw new Error(`Company not found: ${companyId}`);
      }

      if (company.assets.length === 0) {
        throw new Error(`No active assets found for company: ${companyId}`);
      }

      // Crear un nuevo scan
      const scan = await this.prisma.securityScan.create({
        data: {
          companyId,
          status: ScanStatus.RUNNING,
          healthScore: 0,
        }
      });

      // Ejecutar escaneos en background
      this.executeCompanyScan(scan.id, company.assets);

      return scan.id;

    } catch (error) {
      this.logger.error(`Failed to start scan for company ${companyId}:`, error);
      throw error;
    }
  }

  /**
   * Iniciar escaneo para un asset específico (usado por GraphQL)
   */
  async startAssetScan(assetId: string, companyId: string): Promise<{
    scanId: string;
    healthScore: number;
    findings: ScanFinding[];
  }> {
    this.logger.log(`Starting security scan for asset: ${assetId}`);

    try {
      // Verificar que el asset existe y pertenece a la empresa
      const asset = await this.prisma.asset.findFirst({
        where: {
          id: assetId,
          companyId,
        },
      });

      if (!asset) {
        throw new Error(`Asset ${assetId} not found or access denied`);
      }

      // Crear registro de escaneo
      const scan = await this.prisma.securityScan.create({
        data: {
          companyId: asset.companyId,
          status: ScanStatus.RUNNING,
          healthScore: 0,
          startedAt: new Date(),
        },
      });

      // Ejecutar escaneo
      const result = await this.executeScan(asset.domain);

      // Actualizar registro con resultados
      await this.prisma.securityScan.update({
        where: { id: scan.id },
        data: {
          status: ScanStatus.COMPLETED,
          healthScore: result.healthScore,
          completedAt: new Date(),
        },
      });

      // Crear findings en la base de datos
      if (result.findings.length > 0) {
        await this.prisma.finding.createMany({
          data: result.findings.map(finding => ({
            scanId: scan.id,
            category: finding.category,
            severity: finding.severity,
            title: finding.title,
            description: finding.description,
            recommendation: finding.recommendation,
            status: finding.status,
          })),
        });
      }

      this.logger.log(`Completed security scan for asset ${assetId}: ${result.findings.length} findings, health score: ${result.healthScore}`);

      return {
        scanId: scan.id,
        healthScore: result.healthScore,
        findings: result.findings,
      };

    } catch (error) {
      this.logger.error(`Security scan failed for asset ${assetId}:`, error);
      throw error;
    }
  }

  /**
   * Ejecutar todos los escaneos para los assets de una empresa
   */
  private async executeCompanyScan(scanId: string, assets: any[]) {
    try {
      this.logger.log(`Executing scan ${scanId} for ${assets.length} assets`);

      const allFindings = [];

      // Escanear cada asset
      for (const asset of assets) {
        this.logger.log(`Scanning asset: ${asset.domain}`);

        try {
          // 1. Email Security Scan (SPF, DKIM, DMARC)
          const emailFindings = await this.emailScanner.scan(asset.domain);
          allFindings.push(...emailFindings);
          this.logger.debug(`Email scan completed for ${asset.domain}: ${emailFindings.length} findings`);

          // 2. SSL Certificate Scan
          const sslFindings = await this.sslScanner.scan(asset.domain);
          allFindings.push(...sslFindings);
          this.logger.debug(`SSL scan completed for ${asset.domain}: ${sslFindings.length} findings`);

          // 3. Security Headers Scan
          const headerFindings = await this.headersScanner.scan(asset.domain);
          allFindings.push(...headerFindings);
          this.logger.debug(`Headers scan completed for ${asset.domain}: ${headerFindings.length} findings`);

          // 4. Port Scan (básico)
          const portFindings = await this.portScanner.scan(asset.domain);
          allFindings.push(...portFindings);
          this.logger.debug(`Port scan completed for ${asset.domain}: ${portFindings.length} findings`);

        } catch (assetError) {
          this.logger.error(`Failed to scan asset ${asset.domain}:`, assetError);
          
          // Crear finding de error
          allFindings.push({
            category: FindingCategory.WEB_SECURITY,
            severity: Severity.MEDIUM,
            title: 'Asset Scan Failed',
            description: `Failed to perform security scan on ${asset.domain}: ${assetError.message}`,
            recommendation: 'Verify that the domain is accessible and properly configured.',
            status: FindingStatus.OPEN
          });
        }
      }

      // Guardar todos los findings en la base de datos
      for (const finding of allFindings) {
        await this.prisma.finding.create({
          data: {
            scanId,
            category: finding.category,
            severity: finding.severity,
            title: finding.title,
            description: finding.description,
            recommendation: finding.recommendation,
            status: finding.status
          }
        });
      }

      // Calcular health score basado en los findings
      const healthScore = this.calculateHealthScore(allFindings);

      // Actualizar scan como completado
      await this.prisma.securityScan.update({
        where: { id: scanId },
        data: {
          status: ScanStatus.COMPLETED,
          healthScore,
          completedAt: new Date()
        }
      });

      this.logger.log(`Scan completed successfully: ${scanId}, Health Score: ${healthScore}/100`);

    } catch (error) {
      this.logger.error(`Scan execution failed: ${scanId}`, error);
      
      // Marcar scan como fallido
      await this.prisma.securityScan.update({
        where: { id: scanId },
        data: {
          status: ScanStatus.FAILED,
          completedAt: new Date()
        }
      });
    }
  }

  /**
   * Calcular health score basado en los findings encontrados
   */
  private calculateHealthScore(findings: any[]): number {
    if (findings.length === 0) {
      return 100; // Perfecto si no hay findings
    }

    let score = 100;
    
    findings.forEach(finding => {
      switch (finding.severity) {
        case Severity.CRITICAL:
          score -= 25; // -25 puntos por crítico
          break;
        case Severity.HIGH:
          score -= 15; // -15 puntos por alto
          break;
        case Severity.MEDIUM:
          score -= 8;  // -8 puntos por medio
          break;
        case Severity.LOW:
          score -= 3;  // -3 puntos por bajo
          break;
      }
    });

    // El score nunca puede ser menor a 0
    return Math.max(0, score);
  }



  /**
   * Obtener todos los scans de una empresa
   */
  async getCompanyScans(companyId: string, limit: number = 10) {
    return this.prisma.securityScan.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        findings: {
          select: {
            id: true,
            category: true,
            severity: true,
            title: true,
            status: true
          }
        }
      }
    });
  }

  /**
   * Obtener estadísticas de seguridad para una empresa
   */
  async getSecurityStats(companyId: string) {
    const latestScan = await this.prisma.securityScan.findFirst({
      where: { 
        companyId,
        status: ScanStatus.COMPLETED
      },
      orderBy: { createdAt: 'desc' },
      include: {
        findings: true
      }
    });

    if (!latestScan) {
      return {
        healthScore: null,
        totalFindings: 0,
        criticalFindings: 0,
        highFindings: 0,
        mediumFindings: 0,
        lowFindings: 0,
        lastScanDate: null
      };
    }

    const findings = latestScan.findings;
    
    return {
      healthScore: latestScan.healthScore,
      totalFindings: findings.length,
      criticalFindings: findings.filter(f => f.severity === Severity.CRITICAL).length,
      highFindings: findings.filter(f => f.severity === Severity.HIGH).length,
      mediumFindings: findings.filter(f => f.severity === Severity.MEDIUM).length,
      lowFindings: findings.filter(f => f.severity === Severity.LOW).length,
      lastScanDate: latestScan.completedAt
    };
  }

  /**
   * Obtener el último escaneo para un asset específico
   */
  async getLatestScan(assetId: number, companyId: string) {
    const asset = await this.prisma.asset.findFirst({
      where: { 
        id: assetId.toString(),
        companyId 
      }
    });

    if (!asset) {
      return null;
    }

    return await this.prisma.securityScan.findFirst({
      where: { 
        companyId: asset.companyId,
        status: ScanStatus.COMPLETED
      },
      orderBy: { createdAt: 'desc' },
      include: {
        findings: true,
        _count: {
          select: {
            findings: true
          }
        }
      }
    });
  }

  /**
   * Obtener historial de escaneos para un asset
   */
  async getScanHistory(assetId: number, companyId: string, limit: number = 10) {
    const asset = await this.prisma.asset.findFirst({
      where: { 
        id: assetId.toString(),
        companyId 
      }
    });

    if (!asset) {
      return [];
    }

    return await this.prisma.securityScan.findMany({
      where: { 
        companyId: asset.companyId
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        findings: true,
        _count: {
          select: {
            findings: true
          }
        }
      }
    });
  }

  /**
   * Obtener findings de un escaneo específico
   */
  async getScanFindings(scanId: string, companyId: string) {
    const scan = await this.prisma.securityScan.findFirst({
      where: { 
        id: scanId,
        companyId 
      }
    });

    if (!scan) {
      return [];
    }

    return await this.prisma.finding.findMany({
      where: { scanId },
      orderBy: [
        { severity: 'asc' }, // CRITICAL first
        { createdAt: 'desc' }
      ]
    });
  }

  /**
   * Actualizar el estado de un finding
   */
  async updateFindingStatus(findingId: string, status: FindingStatus, companyId: string) {
    // Verificar que el finding pertenece a un escaneo de la empresa
    const finding = await this.prisma.finding.findFirst({
      where: { 
        id: findingId,
        scan: {
          companyId
        }
      }
    });

    if (!finding) {
      throw new Error('Finding not found or access denied');
    }

    return await this.prisma.finding.update({
      where: { id: findingId },
      data: { status }
    });
  }

  /**
   * Escaneo individual para un dominio específico (usado por GraphQL)
   */
  async executeScan(domain: string): Promise<{
    healthScore: number;
    findings: ScanFinding[];
  }> {
    const allFindings: ScanFinding[] = [];

    try {
      this.logger.log(`Executing security scan for domain: ${domain}`);

      // 1. Email Security Scan (SPF, DKIM, DMARC)
      const emailFindings = await this.emailScanner.scan(domain);
      allFindings.push(...emailFindings);
      this.logger.debug(`Email scan completed for ${domain}: ${emailFindings.length} findings`);

      // 2. SSL Certificate Scan
      const sslFindings = await this.sslScanner.scan(domain);
      allFindings.push(...sslFindings);
      this.logger.debug(`SSL scan completed for ${domain}: ${sslFindings.length} findings`);

      // 3. Security Headers Scan
      const headerFindings = await this.headersScanner.scan(domain);
      allFindings.push(...headerFindings);
      this.logger.debug(`Headers scan completed for ${domain}: ${headerFindings.length} findings`);

      // 4. Port Scan
      const portFindings = await this.portScanner.scan(domain);
      allFindings.push(...portFindings);
      this.logger.debug(`Port scan completed for ${domain}: ${portFindings.length} findings`);

      // Calcular health score
      const healthScore = this.calculateHealthScore(allFindings);

      this.logger.log(`Security scan completed for ${domain}: ${allFindings.length} findings, health score: ${healthScore}`);

      return {
        healthScore,
        findings: allFindings
      };

    } catch (error) {
      this.logger.error(`Security scan failed for domain ${domain}:`, error);
      throw error;
    }
  }
}

// Definir ScanFinding interface para uso interno
export interface ScanFinding {
  id?: string;
  category: FindingCategory;
  severity: Severity;
  title: string;
  description: string;
  recommendation: string;
  status: FindingStatus;
}
