import { SSLService } from '../services/ssl.service';
import { ScanResult, SSLResult } from '../types/scan-results';
import { i18n } from '../i18n';

export class SSLCertificateWorker {
  private sslService: SSLService;

  constructor() {
    this.sslService = new SSLService();
  }

  /**
   * Ejecuta el escaneo completo de SSL para un dominio
   */
  async scanSSLSecurity(domain: string): Promise<{
    result: SSLResult & { httpsRedirect: boolean; redirectIssues?: string[] };
    findings: ScanResult[];
    score: number;
  }> {
    const messages = i18n.getMessages();
    console.log(`${messages.ssl.starting} ${domain}`);
    
    const result = await this.sslService.checkSSLSecurity(domain);
    const findings = this.generateFindings(result, messages);
    const score = this.calculateSSLScore(result);

    console.log(`${messages.ssl.completed} ${domain}. Score: ${score}/100`);
    
    return {
      result,
      findings,
      score
    };
  }

  /**
   * Genera findings basados en los resultados del escaneo SSL
   */
  private generateFindings(result: SSLResult & { httpsRedirect: boolean; redirectIssues?: string[] }, messages: any): ScanResult[] {
    const findings: ScanResult[] = [];

    // SSL Certificate Issues
    if (!result.valid && result.issues) {
      result.issues.forEach(issue => {
        let severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'MEDIUM';
        let score = 50;

        if (issue.includes('expired')) {
          severity = 'CRITICAL';
          score = 0;
          findings.push({
            category: 'SSL_CERTIFICATE',
            severity,
            title: 'SSL Certificate Expired',
            description: 'The SSL certificate for this domain has expired. Users will see security warnings.',
            recommendation: 'Renew your SSL certificate immediately through your hosting provider or certificate authority.',
            score
          });
        } else if (issue.includes('expires in') && issue.includes('days')) {
          const daysMatch = issue.match(/(\d+) days/);
          const days = daysMatch ? parseInt(daysMatch[1]) : 0;
          
          if (days <= 7) {
            severity = 'HIGH';
            score = 20;
          } else if (days <= 30) {
            severity = 'MEDIUM';
            score = 70;
          }
          
          findings.push({
            category: 'SSL_CERTIFICATE',
            severity,
            title: 'SSL Certificate Expiring Soon',
            description: `SSL certificate expires in ${days} days. Plan renewal to avoid service interruption.`,
            recommendation: 'Set up automatic certificate renewal or manually renew before expiration.',
            score
          });
        } else if (issue.includes('domain mismatch')) {
          severity = 'HIGH';
          score = 10;
          findings.push({
            category: 'SSL_CERTIFICATE',
            severity,
            title: 'SSL Certificate Domain Mismatch',
            description: 'The SSL certificate is not valid for this domain name.',
            recommendation: 'Install a certificate that matches your domain name or use a wildcard certificate.',
            score
          });
        } else if (issue.includes('Weak cipher') || issue.includes('Outdated TLS')) {
          severity = 'HIGH';
          score = 30;
          findings.push({
            category: 'SSL_CERTIFICATE',
            severity,
            title: 'Weak SSL/TLS Configuration',
            description: 'The server is using outdated or weak SSL/TLS protocols or cipher suites.',
            recommendation: 'Update your server configuration to use TLS 1.2 or 1.3 with strong cipher suites.',
            score
          });
        } else {
          findings.push({
            category: 'SSL_CERTIFICATE',
            severity,
            title: 'SSL Certificate Issue',
            description: issue,
            recommendation: 'Review and fix the SSL certificate configuration.',
            score
          });
        }
      });
    }

    // HTTPS Redirect Issues
    if (!result.httpsRedirect) {
      let severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'MEDIUM';
      let description = 'The website does not redirect HTTP traffic to HTTPS.';
      
      if (result.redirectIssues) {
        const hasHttpContent = result.redirectIssues.some(issue => 
          issue.includes('serves content without redirecting')
        );
        
        if (hasHttpContent) {
          severity = 'HIGH';
          description = 'The website serves content over unencrypted HTTP without redirecting to HTTPS.';
        }
      }

      findings.push({
        category: 'SSL_CERTIFICATE',
        severity,
        title: messages.ssl?.noHttpsRedirect?.title || 'Missing HTTPS Redirect',
        description: messages.ssl?.noHttpsRedirect?.description || description,
        recommendation: messages.ssl?.noHttpsRedirect?.recommendation || 'Configure your web server to automatically redirect all HTTP traffic to HTTPS.',
        score: severity === 'HIGH' ? 20 : 60
      });
    }

    return findings;
  }

  /**
   * Calcula un score de 0-100 basado en la configuración SSL
   */
  private calculateSSLScore(result: SSLResult & { httpsRedirect: boolean; redirectIssues?: string[] }): number {
    let score = 100;

    // SSL Certificate scoring
    if (!result.valid) {
      if (result.issues) {
        result.issues.forEach(issue => {
          if (issue.includes('expired')) {
            score -= 60; // Major penalty for expired certificate
          } else if (issue.includes('expires in') && issue.includes('days')) {
            const daysMatch = issue.match(/(\d+) days/);
            const days = daysMatch ? parseInt(daysMatch[1]) : 0;
            
            if (days <= 7) {
              score -= 30; // High penalty for certificate expiring very soon
            } else if (days <= 30) {
              score -= 10; // Medium penalty for certificate expiring soon
            }
          } else if (issue.includes('domain mismatch')) {
            score -= 40; // Major penalty for domain mismatch
          } else if (issue.includes('Weak cipher') || issue.includes('Outdated TLS')) {
            score -= 25; // High penalty for weak crypto
          } else {
            score -= 15; // General SSL issue
          }
        });
      } else {
        score -= 50; // General invalid certificate
      }
    }

    // HTTPS Redirect scoring
    if (!result.httpsRedirect) {
      if (result.redirectIssues) {
        const hasHttpContent = result.redirectIssues.some(issue => 
          issue.includes('serves content without redirecting')
        );
        
        if (hasHttpContent) {
          score -= 25; // High penalty for serving HTTP content
        } else {
          score -= 15; // Medium penalty for no redirect
        }
      } else {
        score -= 15; // Medium penalty for no redirect
      }
    }

    return Math.max(0, score); // Ensure score doesn't go below 0
  }
}
