import { Injectable, Logger } from '@nestjs/common';
import { FindingCategory, Severity, FindingStatus } from '@prisma/client';
import * as https from 'https';
import * as tls from 'tls';
import { ScanFinding } from './email-security.scanner';

@Injectable()
export class SSLCertificateScanner {
  private readonly logger = new Logger(SSLCertificateScanner.name);

  async scan(domain: string): Promise<ScanFinding[]> {
    const findings: ScanFinding[] = [];
    
    this.logger.log(`Starting SSL certificate scan for domain: ${domain}`);

    try {
      // Verificar certificado SSL/TLS
      const certInfo = await this.getCertificateInfo(domain);
      
      if (!certInfo.valid) {
        findings.push({
          category: FindingCategory.SSL_CERTIFICATE,
          severity: Severity.CRITICAL,
          title: 'SSL Certificate Invalid or Missing',
          description: `Domain ${domain} ${certInfo.error}`,
          recommendation: 'Install a valid SSL certificate from a trusted Certificate Authority (CA). Consider using Let\'s Encrypt for free certificates.',
          status: FindingStatus.OPEN
        });
        return findings;
      }

      // 1. Verificar expiración del certificado
      const expirationCheck = this.checkCertificateExpiration(certInfo.certificate!);
      if (expirationCheck.warning) {
        findings.push({
          category: FindingCategory.SSL_CERTIFICATE,
          severity: expirationCheck.severity!,
          title: 'SSL Certificate Expiration Warning',
          description: expirationCheck.description!,
          recommendation: 'Renew your SSL certificate before it expires. Consider setting up automatic renewal if using Let\'s Encrypt or similar services.',
          status: FindingStatus.OPEN
        });
      }

      // 2. Verificar algoritmo de firma
      const signatureAlgorithm = certInfo.certificate!.signatureAlgorithm;
      if (signatureAlgorithm.includes('sha1')) {
        findings.push({
          category: FindingCategory.SSL_CERTIFICATE,
          severity: Severity.HIGH,
          title: 'Weak Certificate Signature Algorithm',
          description: `SSL certificate uses weak signature algorithm: ${signatureAlgorithm}. SHA-1 is deprecated and considered insecure.`,
          recommendation: 'Replace the certificate with one using SHA-256 or higher signature algorithm.',
          status: FindingStatus.OPEN
        });
      }

      // 3. Verificar longitud de clave
      const keyLength = this.extractKeyLength(certInfo.certificate!);
      if (keyLength && keyLength < 2048) {
        findings.push({
          category: FindingCategory.SSL_CERTIFICATE,
          severity: Severity.HIGH,
          title: 'Weak SSL Certificate Key Length',
          description: `SSL certificate uses ${keyLength}-bit key. Keys shorter than 2048 bits are considered weak.`,
          recommendation: 'Replace the certificate with one using at least 2048-bit RSA key or 256-bit ECC key.',
          status: FindingStatus.OPEN
        });
      }

      // 4. Verificar cadena de certificados
      if (!certInfo.certificate!.issuer) {
        findings.push({
          category: FindingCategory.SSL_CERTIFICATE,
          severity: Severity.MEDIUM,
          title: 'SSL Certificate Chain Issues',
          description: 'SSL certificate may have issues with the certificate chain.',
          recommendation: 'Verify that the complete certificate chain is properly configured on the server.',
          status: FindingStatus.OPEN
        });
      }

      // 5. Verificar si es self-signed
      if (this.isSelfSigned(certInfo.certificate!)) {
        findings.push({
          category: FindingCategory.SSL_CERTIFICATE,
          severity: Severity.HIGH,
          title: 'Self-Signed SSL Certificate',
          description: 'Domain uses a self-signed SSL certificate which will trigger browser warnings.',
          recommendation: 'Replace with a certificate from a trusted Certificate Authority (CA).',
          status: FindingStatus.OPEN
        });
      }

      // 6. Verificar protocolos TLS soportados
      const tlsCheck = await this.checkTLSProtocols(domain);
      findings.push(...tlsCheck);

      this.logger.log(`SSL certificate scan completed for ${domain}: ${findings.length} findings`);
      return findings;

    } catch (error) {
      this.logger.error(`SSL certificate scan failed for ${domain}:`, error);
      
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

  /**
   * Obtener información del certificado SSL
   */
  private async getCertificateInfo(domain: string): Promise<{
    valid: boolean;
    certificate?: any;
    error?: string;
  }> {
    return new Promise((resolve) => {
      const options = {
        hostname: domain,
        port: 443,
        method: 'GET',
        timeout: 10000,
        rejectUnauthorized: false // Para poder analizar certificados inválidos
      };

      const req = https.request(options, (res) => {
        const certificate = (res.socket as any)?.getPeerCertificate?.(true);
        
        if (certificate && Object.keys(certificate).length > 0) {
          resolve({ valid: true, certificate });
        } else {
          resolve({ valid: false, error: 'no SSL certificate found' });
        }
      });

      req.on('error', (error) => {
        this.logger.debug(`SSL connection failed for ${domain}: ${error.message}`);
        resolve({ valid: false, error: `SSL connection failed: ${error.message}` });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({ valid: false, error: 'SSL connection timeout' });
      });

      req.setTimeout(10000);
      req.end();
    });
  }

  /**
   * Verificar la expiración del certificado
   */
  private checkCertificateExpiration(certificate: any): {
    warning: boolean;
    severity?: Severity;
    description?: string;
  } {
    if (!certificate.valid_to) {
      return { warning: false };
    }

    const expirationDate = new Date(certificate.valid_to);
    const now = new Date();
    const daysUntilExpiration = Math.ceil((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiration < 0) {
      return {
        warning: true,
        severity: Severity.CRITICAL,
        description: `SSL certificate expired ${Math.abs(daysUntilExpiration)} days ago on ${expirationDate.toDateString()}.`
      };
    } else if (daysUntilExpiration <= 7) {
      return {
        warning: true,
        severity: Severity.HIGH,
        description: `SSL certificate will expire in ${daysUntilExpiration} days on ${expirationDate.toDateString()}.`
      };
    } else if (daysUntilExpiration <= 30) {
      return {
        warning: true,
        severity: Severity.MEDIUM,
        description: `SSL certificate will expire in ${daysUntilExpiration} days on ${expirationDate.toDateString()}.`
      };
    }

    return { warning: false };
  }

  /**
   * Extraer la longitud de la clave del certificado
   */
  private extractKeyLength(certificate: any): number | null {
    try {
      // Intentar obtener la información de la clave pública
      if (certificate.pubkey) {
        // Para RSA, la longitud está en bits
        return certificate.pubkey.bits || null;
      }
      
      // Si no está disponible directamente, intentar parsing del algoritmo
      const algorithm = certificate.signatureAlgorithm || '';
      if (algorithm.includes('2048')) return 2048;
      if (algorithm.includes('4096')) return 4096;
      if (algorithm.includes('1024')) return 1024;
      
      return null;
    } catch (error) {
      this.logger.debug(`Could not extract key length: ${error.message}`);
      return null;
    }
  }

  /**
   * Verificar si el certificado es self-signed
   */
  private isSelfSigned(certificate: any): boolean {
    try {
      return certificate.issuer && certificate.subject && 
             JSON.stringify(certificate.issuer) === JSON.stringify(certificate.subject);
    } catch (error) {
      return false;
    }
  }

  /**
   * Verificar protocolos TLS soportados
   */
  private async checkTLSProtocols(domain: string): Promise<ScanFinding[]> {
    const findings: ScanFinding[] = [];
    const protocols = ['TLSv1', 'TLSv1.1', 'TLSv1.2', 'TLSv1.3'];
    
    try {
      for (const protocol of protocols) {
        const supported = await this.testTLSProtocol(domain, protocol);
        
        if (supported && (protocol === 'TLSv1' || protocol === 'TLSv1.1')) {
          findings.push({
            category: FindingCategory.SSL_CERTIFICATE,
            severity: Severity.MEDIUM,
            title: `Insecure TLS Protocol Supported: ${protocol}`,
            description: `Domain supports deprecated TLS protocol ${protocol} which has known security vulnerabilities.`,
            recommendation: `Disable support for ${protocol} and use only TLS 1.2 and TLS 1.3.`,
            status: FindingStatus.OPEN
          });
        }
      }

      // Verificar si soporta TLS 1.2 o superior
      const supportsTLS12 = await this.testTLSProtocol(domain, 'TLSv1.2');
      const supportsTLS13 = await this.testTLSProtocol(domain, 'TLSv1.3');

      if (!supportsTLS12 && !supportsTLS13) {
        findings.push({
          category: FindingCategory.SSL_CERTIFICATE,
          severity: Severity.HIGH,
          title: 'Modern TLS Protocols Not Supported',
          description: 'Domain does not support TLS 1.2 or TLS 1.3, using only older insecure protocols.',
          recommendation: 'Enable support for TLS 1.2 and TLS 1.3 for better security.',
          status: FindingStatus.OPEN
        });
      }

    } catch (error) {
      this.logger.debug(`TLS protocol check failed for ${domain}: ${error.message}`);
    }

    return findings;
  }

  /**
   * Probar un protocolo TLS específico
   */
  private async testTLSProtocol(domain: string, protocol: string): Promise<boolean> {
    return new Promise((resolve) => {
      const options = {
        host: domain,
        port: 443,
        secureProtocol: `${protocol.replace('.', '_')}_method`,
        timeout: 5000
      };

      const socket = tls.connect(options, () => {
        socket.end();
        resolve(true);
      });

      socket.on('error', () => {
        resolve(false);
      });

      socket.on('timeout', () => {
        socket.destroy();
        resolve(false);
      });

      socket.setTimeout(5000);
    });
  }
}
