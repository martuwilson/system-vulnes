import { DNSService } from '../services/dns.service';
import { ScanResult, DNSSecurityResult } from '../types/scan-results';

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
    console.log(`🔍 Starting DNS security scan for: ${domain}`);
    
    const result = await this.dnsService.checkDNSSecurity(domain);
    const findings = this.generateFindings(result);
    const score = this.calculateDNSScore(result);

    console.log(`✅ DNS scan completed for ${domain}. Score: ${score}/100`);
    
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

    // SPF Findings
    if (!result.spf.exists) {
      findings.push({
        category: 'EMAIL_SECURITY',
        severity: 'HIGH',
        title: 'SPF Record Missing',
        description: 'No SPF record found for this domain. This allows attackers to easily spoof emails from your domain.',
        recommendation: 'Create an SPF record in your DNS settings. Start with "v=spf1 include:_spf.google.com ~all" if using Google Workspace.',
        score: 0
      });
    } else if (!result.spf.valid && result.spf.issues) {
      result.spf.issues.forEach(issue => {
        findings.push({
          category: 'EMAIL_SECURITY',
          severity: 'MEDIUM',
          title: 'SPF Configuration Issue',
          description: issue,
          recommendation: 'Review and update your SPF record to follow best practices.',
          score: 70
        });
      });
    }

    // DMARC Findings
    if (!result.dmarc.exists) {
      findings.push({
        category: 'EMAIL_SECURITY',
        severity: 'HIGH',
        title: 'DMARC Record Missing',
        description: 'No DMARC record found. Your domain is vulnerable to email spoofing and phishing attacks.',
        recommendation: 'Implement a DMARC record starting with "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com"',
        score: 0
      });
    } else if (result.dmarc.policy === 'none') {
      findings.push({
        category: 'EMAIL_SECURITY',
        severity: 'MEDIUM', 
        title: 'DMARC Policy Too Permissive',
        description: 'DMARC policy is set to "none", which provides monitoring but no protection against spoofing.',
        recommendation: 'Upgrade DMARC policy to "quarantine" or "reject" for better email security.',
        score: 60
      });
    }

    // DKIM Findings
    if (!result.dkim.configured) {
      findings.push({
        category: 'EMAIL_SECURITY',
        severity: 'MEDIUM',
        title: 'DKIM Not Configured',
        description: 'No DKIM records found with common selectors. Email authentication may be incomplete.',
        recommendation: 'Configure DKIM signing with your email provider to improve email deliverability and security.',
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
