import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { PrismaService } from '../prisma/prisma.service';
import { EmailSecurityScanner } from './scanners/email-security.scanner';
import { SSLCertificateScanner } from './scanners/ssl-certificate.scanner';
import { SecurityHeadersScanner } from './scanners/security-headers.scanner';
import { PortScanner } from './scanners/port.scanner';
import { FindingCategory, Severity, FindingStatus, ScanStatus } from '@prisma/client';

export interface SecurityScanJob {
  scanId: string;
  domain: string;
  assetId: string;
  companyId: string;
  userId: string;
}

interface SecurityFinding {
  category: FindingCategory;
  severity: Severity;
  title: string;
  description: string;
  recommendation: string;
  status?: FindingStatus;
}

@Processor('security-scan')
export class SecurityProcessor {
  private readonly logger = new Logger(SecurityProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailScanner: EmailSecurityScanner,
    private readonly sslScanner: SSLCertificateScanner,
    private readonly headersScanner: SecurityHeadersScanner,
    private readonly portScanner: PortScanner,
  ) {}

  @Process('execute-scan')
  async handleSecurityScan(job: Job<SecurityScanJob>) {
    const { scanId, domain, assetId, companyId, userId } = job.data;
    
    this.logger.log(`Processing security scan job for domain: ${domain}, scanId: ${scanId}`);

    try {
      // Actualizar el scan como "en progreso"
      await this.updateScanStatus(scanId, ScanStatus.RUNNING, companyId, domain);

      // Ejecutar todos los scanners en paralelo
      const [
        emailFindings,
        sslFindings,
        headerFindings,
        portFindings,
      ] = await Promise.allSettled([
        this.executeEmailScan(domain),
        this.executeSSLScan(domain),
        this.executeHeaderScan(domain),
        this.executePortScan(domain),
      ]);

      // Consolidar resultados
      const allFindings = this.consolidateFindings([
        emailFindings,
        sslFindings,
        headerFindings,
        portFindings,
      ]);

      // Calcular health score
      const healthScore = this.calculateHealthScore(allFindings);

      // Guardar resultados en la base de datos
      await this.saveResults(scanId, assetId, companyId, domain, allFindings, healthScore);

      // Actualizar el scan como completado
      await this.updateScanStatus(scanId, ScanStatus.COMPLETED, companyId, domain);

      this.logger.log(`Security scan completed for ${domain}: ${allFindings.length} findings, health score: ${healthScore}`);

      return {
        scanId,
        domain,
        findingsCount: allFindings.length,
        healthScore,
        status: 'COMPLETED',
      };

    } catch (error) {
      this.logger.error(`Security scan failed for ${domain}:`, error);
      
      // Actualizar el scan como fallido
      await this.updateScanStatus(scanId, ScanStatus.FAILED, companyId, domain);
      
      throw error;
    }
  }

  private async executeEmailScan(domain: string): Promise<SecurityFinding[]> {
    try {
      this.logger.debug(`Starting email security scan for ${domain}`);
      return await this.emailScanner.scan(domain);
    } catch (error) {
      this.logger.error(`Email scan failed for ${domain}:`, error);
      return [{
        category: FindingCategory.EMAIL_SECURITY,
        severity: Severity.HIGH,
        title: 'Email Security Scan Failed',
        description: `Unable to complete email security scan for ${domain}: ${error.message}`,
        recommendation: 'Verify that the domain is properly configured and accessible.',
        status: FindingStatus.OPEN
      }];
    }
  }

  private async executeSSLScan(domain: string): Promise<SecurityFinding[]> {
    try {
      this.logger.debug(`Starting SSL certificate scan for ${domain}`);
      return await this.sslScanner.scan(domain);
    } catch (error) {
      this.logger.error(`SSL scan failed for ${domain}:`, error);
      return [{
        category: FindingCategory.SSL_CERTIFICATE,
        severity: Severity.HIGH,
        title: 'SSL Certificate Scan Failed',
        description: `Unable to complete SSL certificate scan for ${domain}: ${error.message}`,
        recommendation: 'Verify that the domain supports HTTPS and is accessible on port 443.',
        status: FindingStatus.OPEN
      }];
    }
  }

  private async executeHeaderScan(domain: string): Promise<SecurityFinding[]> {
    try {
      this.logger.debug(`Starting security headers scan for ${domain}`);
      return await this.headersScanner.scan(domain);
    } catch (error) {
      this.logger.error(`Headers scan failed for ${domain}:`, error);
      return [{
        category: FindingCategory.WEB_SECURITY,
        severity: Severity.MEDIUM,
        title: 'Security Headers Scan Failed',
        description: `Unable to complete security headers scan for ${domain}: ${error.message}`,
        recommendation: 'Verify that the domain is accessible via HTTP/HTTPS.',
        status: FindingStatus.OPEN
      }];
    }
  }

  private async executePortScan(domain: string): Promise<SecurityFinding[]> {
    try {
      this.logger.debug(`Starting port scan for ${domain}`);
      return await this.portScanner.scan(domain);
    } catch (error) {
      this.logger.error(`Port scan failed for ${domain}:`, error);
      return [{
        category: FindingCategory.NETWORK_SECURITY,
        severity: Severity.MEDIUM,
        title: 'Port Scan Failed',
        description: `Unable to complete port scan for ${domain}: ${error.message}`,
        recommendation: 'Verify that the domain is resolvable and network accessible.',
        status: FindingStatus.OPEN
      }];
    }
  }

  private consolidateFindings(results: PromiseSettledResult<SecurityFinding[]>[]): SecurityFinding[] {
    const allFindings: SecurityFinding[] = [];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        allFindings.push(...result.value);
      } else {
        this.logger.warn(`Scanner ${index} failed:`, result.reason);
      }
    });

    return allFindings;
  }

  private calculateHealthScore(findings: SecurityFinding[]): number {
    if (findings.length === 0) {
      return 100; // Sin hallazgos = perfecto
    }

    // Contar por severidad
    const counts = {
      critical: findings.filter(f => f.severity === Severity.CRITICAL).length,
      high: findings.filter(f => f.severity === Severity.HIGH).length,
      medium: findings.filter(f => f.severity === Severity.MEDIUM).length,
      low: findings.filter(f => f.severity === Severity.LOW).length,
    };

    // Sistema de penalización más balanceado
    // Cada tipo de problema resta un porcentaje, pero con límites
    const criticalPenalty = Math.min(counts.critical * 12, 40); // Max 40% por críticos
    const highPenalty = Math.min(counts.high * 8, 30);          // Max 30% por high
    const mediumPenalty = Math.min(counts.medium * 4, 20);      // Max 20% por medium
    const lowPenalty = Math.min(counts.low * 1.5, 10);          // Max 10% por low

    const totalPenalty = criticalPenalty + highPenalty + mediumPenalty + lowPenalty;
    const score = 100 - totalPenalty;

    // El score mínimo es 15% (nunca 0%, siempre hay algo rescatable)
    return Math.max(Math.round(score), 15);
  }

  private async saveResults(
    scanId: string,
    assetId: string,
    companyId: string,
    domain: string,
    findings: SecurityFinding[],
    healthScore: number
  ): Promise<void> {
    try {
      // Guardar el scan
      await this.prisma.securityScan.upsert({
        where: { id: scanId },
        create: {
          id: scanId,
          companyId,
          domain,
          status: ScanStatus.COMPLETED,
          healthScore,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        update: {
          status: ScanStatus.COMPLETED,
          healthScore,
          completedAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // Guardar los findings
      for (const finding of findings) {
        await this.prisma.finding.create({
          data: {
            scanId,
            category: finding.category,
            severity: finding.severity,
            title: finding.title,
            description: finding.description,
            recommendation: finding.recommendation,
            status: finding.status || FindingStatus.OPEN,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
      }

      this.logger.debug(`Saved ${findings.length} findings for scan ${scanId}`);
    } catch (error) {
      this.logger.error(`Failed to save scan results for ${scanId}:`, error);
      throw error;
    }
  }

  private async updateScanStatus(scanId: string, status: ScanStatus, companyId: string, domain: string): Promise<void> {
    try {
      await this.prisma.securityScan.upsert({
        where: { id: scanId },
        create: {
          id: scanId,
          companyId: companyId,
          domain: domain,
          status: status,
          healthScore: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        update: {
          status: status,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      this.logger.error(`Failed to update scan status for ${scanId}:`, error);
    }
  }
}
