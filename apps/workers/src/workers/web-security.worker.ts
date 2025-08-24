import { WebSecurityService } from '../services/web-security.service';
import { ScanResult, WebSecurityResult } from '../types/scan-results';
import { i18n } from '../i18n';

export class WebSecurityWorker {
  private webSecurityService: WebSecurityService;

  constructor() {
    this.webSecurityService = new WebSecurityService();
  }

  /**
   * Ejecuta el escaneo completo de headers de seguridad web para un dominio
   */
  async scanWebSecurity(domain: string): Promise<{
    result: WebSecurityResult;
    findings: ScanResult[];
    score: number;
  }> {
    const messages = i18n.getMessages();
    console.log(`🌐 ${messages.webSecurity?.starting || 'Starting web security scan for:'} ${domain}`);
    
    const [result, detailedHeaders] = await Promise.all([
      this.webSecurityService.checkSecurityHeaders(domain),
      this.webSecurityService.checkDetailedHeaders(domain)
    ]);

    const findings = this.generateFindings(result, detailedHeaders, messages);
    const score = this.calculateWebSecurityScore(result);

    console.log(`✅ ${messages.webSecurity?.completed || 'Web security scan completed for'} ${domain}. Score: ${score}/100`);
    
    return {
      result,
      findings,
      score
    };
  }

  /**
   * Genera findings basados en los resultados del escaneo de headers web
   */
  private generateFindings(
    result: WebSecurityResult,
    detailedHeaders: any,
    messages: any
  ): ScanResult[] {
    const findings: ScanResult[] = [];

    // HTTPS Redirect
    if (!result.httpsRedirect) {
      findings.push({
        category: 'WEB_SECURITY',
        severity: 'HIGH',
        title: messages.webSecurity?.noHttpsRedirect?.title || 'Missing HTTPS Redirect',
        description: messages.webSecurity?.noHttpsRedirect?.description || 'Website does not redirect HTTP traffic to HTTPS, allowing insecure connections.',
        recommendation: messages.webSecurity?.noHttpsRedirect?.recommendation || 'Configure your web server to automatically redirect all HTTP traffic to HTTPS.',
        score: 20
      });
    }

    // HSTS Header
    if (!result.headers.hsts) {
      findings.push({
        category: 'WEB_SECURITY',
        severity: 'MEDIUM',
        title: messages.webSecurity?.missingHsts?.title || 'Missing HSTS Header',
        description: messages.webSecurity?.missingHsts?.description || 'HTTP Strict Transport Security header is missing, making connections vulnerable to downgrade attacks.',
        recommendation: messages.webSecurity?.missingHsts?.recommendation || 'Add "Strict-Transport-Security: max-age=31536000; includeSubDomains" header to your server configuration.',
        score: 70
      });
    } else if (detailedHeaders.hstsDetails) {
      const hsts = detailedHeaders.hstsDetails;
      if (hsts.maxAge && hsts.maxAge < 31536000) { // Less than 1 year
        findings.push({
          category: 'WEB_SECURITY',
          severity: 'LOW',
          title: messages.webSecurity?.weakHsts?.title || 'Weak HSTS Configuration',
          description: messages.webSecurity?.weakHsts?.description || `HSTS max-age is too short (${Math.floor(hsts.maxAge / 86400)} days). Consider using at least 1 year.`,
          recommendation: messages.webSecurity?.weakHsts?.recommendation || 'Increase HSTS max-age to at least 31536000 seconds (1 year).',
          score: 85
        });
      }
    }

    // Content Security Policy
    if (!result.headers.csp) {
      findings.push({
        category: 'WEB_SECURITY',
        severity: 'HIGH',
        title: messages.webSecurity?.missingCsp?.title || 'Missing Content Security Policy',
        description: messages.webSecurity?.missingCsp?.description || 'No Content Security Policy header found, leaving the site vulnerable to XSS and code injection attacks.',
        recommendation: messages.webSecurity?.missingCsp?.recommendation || 'Implement a Content Security Policy header to prevent XSS attacks. Start with "Content-Security-Policy: default-src \'self\'".',
        score: 30
      });
    } else if (detailedHeaders.cspDetails) {
      const csp = detailedHeaders.cspDetails;
      if (csp.hasUnsafeInline || csp.hasUnsafeEval) {
        findings.push({
          category: 'WEB_SECURITY',
          severity: 'MEDIUM',
          title: messages.webSecurity?.weakCsp?.title || 'Weak Content Security Policy',
          description: messages.webSecurity?.weakCsp?.description || 'CSP contains unsafe directives (unsafe-inline or unsafe-eval) that reduce security effectiveness.',
          recommendation: messages.webSecurity?.weakCsp?.recommendation || 'Remove unsafe-inline and unsafe-eval from your CSP and use nonces or hashes instead.',
          score: 60
        });
      }
    }

    // X-Frame-Options
    if (!result.headers.xFrameOptions) {
      findings.push({
        category: 'WEB_SECURITY',
        severity: 'MEDIUM',
        title: messages.webSecurity?.missingFrameOptions?.title || 'Missing X-Frame-Options Header',
        description: messages.webSecurity?.missingFrameOptions?.description || 'X-Frame-Options header is missing, making the site vulnerable to clickjacking attacks.',
        recommendation: messages.webSecurity?.missingFrameOptions?.recommendation || 'Add "X-Frame-Options: DENY" or "X-Frame-Options: SAMEORIGIN" header to prevent clickjacking.',
        score: 75
      });
    }

    // X-Content-Type-Options
    if (!result.headers.xContentTypeOptions) {
      findings.push({
        category: 'WEB_SECURITY',
        severity: 'LOW',
        title: messages.webSecurity?.missingContentType?.title || 'Missing X-Content-Type-Options Header',
        description: messages.webSecurity?.missingContentType?.description || 'X-Content-Type-Options header is missing, allowing MIME type sniffing attacks.',
        recommendation: messages.webSecurity?.missingContentType?.recommendation || 'Add "X-Content-Type-Options: nosniff" header to prevent MIME sniffing.',
        score: 90
      });
    }

    // X-XSS-Protection
    if (!result.headers.xXSSProtection) {
      findings.push({
        category: 'WEB_SECURITY',
        severity: 'LOW',
        title: messages.webSecurity?.missingXssProtection?.title || 'Missing X-XSS-Protection Header',
        description: messages.webSecurity?.missingXssProtection?.description || 'X-XSS-Protection header is missing, disabling browser XSS filtering.',
        recommendation: messages.webSecurity?.missingXssProtection?.recommendation || 'Add "X-XSS-Protection: 1; mode=block" header to enable XSS filtering.',
        score: 90
      });
    }

    // Issues from service
    if (result.issues && result.issues.length > 0) {
      result.issues.forEach(issue => {
        findings.push({
          category: 'WEB_SECURITY',
          severity: 'MEDIUM',
          title: messages.webSecurity?.genericIssue?.title || 'Web Security Issue',
          description: issue,
          recommendation: messages.webSecurity?.genericIssue?.recommendation || 'Review and resolve the web security configuration issue.',
          score: 60
        });
      });
    }

    return findings;
  }

  /**
   * Calcula un score de 0-100 basado en los headers de seguridad
   */
  private calculateWebSecurityScore(result: WebSecurityResult): number {
    let score = 100;

    // HTTPS Redirect scoring
    if (!result.httpsRedirect) {
      score -= 25; // Major penalty for no HTTPS redirect
    }

    // Security headers scoring
    if (!result.headers.hsts) {
      score -= 20; // High penalty for missing HSTS
    }

    if (!result.headers.csp) {
      score -= 25; // Major penalty for missing CSP
    }

    if (!result.headers.xFrameOptions) {
      score -= 15; // Medium penalty for missing frame options
    }

    if (!result.headers.xContentTypeOptions) {
      score -= 10; // Low penalty for missing content type options
    }

    if (!result.headers.xXSSProtection) {
      score -= 5; // Low penalty for missing XSS protection
    }

    // Additional issues penalty
    if (result.issues && result.issues.length > 0) {
      score -= Math.min(result.issues.length * 10, 30); // Up to 30 points for additional issues
    }

    return Math.max(0, score); // Ensure score doesn't go below 0
  }
}
