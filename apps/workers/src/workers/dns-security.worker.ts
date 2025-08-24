import { DNSService } from '../services/dns.service';
import { ScanResult, DNSSecurityResult } from '../types/scan-results';
import { i18n } from '../i18n';

export class DNSSecurityWorker {
  private dnsService: DNSService;

  constructor() {
    this.dnsService = new DNSService();
  }

  /**
   * Ejecuta el escaneo completo de seguridad DNS para un dominio
   */
  async scanDNSSecurity(domain: string): Promise<{
    result: DNSSecurityResult;
    findings: ScanResult[];
    score: number;
  }> {
    const messages = i18n.getMessages();
    console.log(`${messages.dns.starting} ${domain}`);
    
    const result = await this.dnsService.checkDNSSecurity(domain);
    const findings = this.generateFindings(result);
    const score = this.calculateDNSScore(result);

    console.log(`${messages.dns.completed} ${domain}. Score: ${score}/100`);
    
    return {
      result,
      findings,
      score
    };
  }

  /**
   * Genera findings basados en los resultados del escaneo DNS
   */
  private generateFindings(result: DNSSecurityResult): ScanResult[] {
    const findings: ScanResult[] = [];
    const messages = i18n.getMessages();

    // SPF Findings
    if (!result.spf.exists) {
      findings.push({
        category: 'EMAIL_SECURITY',
        severity: 'HIGH',
        title: messages.dns.spf.missing.title,
        description: messages.dns.spf.missing.description,
        recommendation: messages.dns.spf.missing.recommendation,
        score: 0
      });
    } else if (!result.spf.valid && result.spf.issues) {
      result.spf.issues.forEach(issue => {
        findings.push({
          category: 'EMAIL_SECURITY',
          severity: 'MEDIUM',
          title: messages.dns.spf.invalid.title,
          description: issue,
          recommendation: messages.dns.spf.invalid.recommendation,
          score: 70
        });
      });
    }

    // DMARC Findings
    if (!result.dmarc.exists) {
      findings.push({
        category: 'EMAIL_SECURITY',
        severity: 'HIGH',
        title: messages.dns.dmarc.missing.title,
        description: messages.dns.dmarc.missing.description,
        recommendation: messages.dns.dmarc.missing.recommendation,
        score: 0
      });
    } else if (result.dmarc.policy === 'none') {
      findings.push({
        category: 'EMAIL_SECURITY',
        severity: 'MEDIUM', 
        title: messages.dns.dmarc.permissive.title,
        description: messages.dns.dmarc.permissive.description,
        recommendation: messages.dns.dmarc.permissive.recommendation,
        score: 60
      });
    }

    // DKIM Findings
    if (!result.dkim.configured) {
      findings.push({
        category: 'EMAIL_SECURITY',
        severity: 'MEDIUM',
        title: messages.dns.dkim.missing.title,
        description: messages.dns.dkim.missing.description,
        recommendation: messages.dns.dkim.missing.recommendation,
        score: 50
      });
    }

    return findings;
  }

  /**
   * Calcula un score de 0-100 basado en la configuración DNS
   */
  private calculateDNSScore(result: DNSSecurityResult): number {
    let score = 100;

    // SPF scoring
    if (!result.spf.exists) {
      score -= 40; // Major penalty for missing SPF
    } else if (!result.spf.valid) {
      score -= 15; // Medium penalty for invalid SPF
    }

    // DMARC scoring
    if (!result.dmarc.exists) {
      score -= 30; // Major penalty for missing DMARC
    } else if (result.dmarc.policy === 'none') {
      score -= 15; // Medium penalty for permissive policy
    }

    // DKIM scoring
    if (!result.dkim.configured) {
      score -= 15; // Medium penalty for missing DKIM
    }

    return Math.max(0, score); // Ensure score doesn't go below 0
  }
}
