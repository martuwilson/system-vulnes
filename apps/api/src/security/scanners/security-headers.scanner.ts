import { Injectable, Logger } from '@nestjs/common';
import { FindingCategory, Severity, FindingStatus } from '@prisma/client';
import axios from 'axios';
import { ScanFinding } from './email-security.scanner';

@Injectable()
export class SecurityHeadersScanner {
  private readonly logger = new Logger(SecurityHeadersScanner.name);

  async scan(domain: string): Promise<ScanFinding[]> {
    const findings: ScanFinding[] = [];
    
    this.logger.log(`Starting security headers scan for domain: ${domain}`);

    try {
      // Realizar request HTTP para obtener headers
      const headers = await this.getSecurityHeaders(domain);
      
      if (!headers.success) {
        findings.push({
          category: FindingCategory.WEB_SECURITY,
          severity: Severity.MEDIUM,
          title: 'Unable to Retrieve Security Headers',
          description: `Failed to retrieve HTTP headers from ${domain}: ${headers.error}`,
          recommendation: 'Verify that the domain is accessible via HTTP/HTTPS.',
          status: FindingStatus.OPEN
        });
        return findings;
      }

      const httpHeaders = headers.headers!;

      // 1. Verificar HSTS (HTTP Strict Transport Security)
      const hstsCheck = this.checkHSTS(httpHeaders);
      if (!hstsCheck.valid) {
        findings.push({
          category: FindingCategory.WEB_SECURITY,
          severity: hstsCheck.severity!,
          title: 'HSTS Header Missing or Misconfigured',
          description: hstsCheck.description!,
          recommendation: 'Add "Strict-Transport-Security: max-age=31536000; includeSubDomains; preload" header to force HTTPS connections.',
          status: FindingStatus.OPEN
        });
      }

      // 2. Verificar CSP (Content Security Policy)
      const cspCheck = this.checkCSP(httpHeaders);
      if (!cspCheck.valid) {
        findings.push({
          category: FindingCategory.WEB_SECURITY,
          severity: cspCheck.severity!,
          title: 'Content Security Policy Issues',
          description: cspCheck.description!,
          recommendation: cspCheck.recommendation!,
          status: FindingStatus.OPEN
        });
      }

      // 3. Verificar X-Frame-Options
      const frameOptionsCheck = this.checkFrameOptions(httpHeaders);
      if (!frameOptionsCheck.valid) {
        findings.push({
          category: FindingCategory.WEB_SECURITY,
          severity: Severity.MEDIUM,
          title: 'X-Frame-Options Header Missing',
          description: 'Missing X-Frame-Options header allows the page to be embedded in iframes, potentially enabling clickjacking attacks.',
          recommendation: 'Add "X-Frame-Options: SAMEORIGIN" or "X-Frame-Options: DENY" header to prevent clickjacking.',
          status: FindingStatus.OPEN
        });
      }

      // 4. Verificar X-Content-Type-Options
      const contentTypeOptionsCheck = this.checkContentTypeOptions(httpHeaders);
      if (!contentTypeOptionsCheck.valid) {
        findings.push({
          category: FindingCategory.WEB_SECURITY,
          severity: Severity.LOW,
          title: 'X-Content-Type-Options Header Missing',
          description: 'Missing X-Content-Type-Options header allows browsers to MIME-sniff content types, potentially enabling attacks.',
          recommendation: 'Add "X-Content-Type-Options: nosniff" header to prevent MIME type sniffing.',
          status: FindingStatus.OPEN
        });
      }

      // 5. Verificar X-XSS-Protection
      const xssProtectionCheck = this.checkXSSProtection(httpHeaders);
      if (!xssProtectionCheck.valid) {
        findings.push({
          category: FindingCategory.WEB_SECURITY,
          severity: Severity.LOW,
          title: 'X-XSS-Protection Header Issues',
          description: xssProtectionCheck.description!,
          recommendation: 'Add "X-XSS-Protection: 1; mode=block" header or rely on a strong CSP instead.',
          status: FindingStatus.OPEN
        });
      }

      // 6. Verificar Referrer Policy
      const referrerPolicyCheck = this.checkReferrerPolicy(httpHeaders);
      if (!referrerPolicyCheck.valid) {
        findings.push({
          category: FindingCategory.WEB_SECURITY,
          severity: Severity.LOW,
          title: 'Referrer-Policy Header Missing',
          description: 'Missing Referrer-Policy header may leak sensitive information in the Referer header to external sites.',
          recommendation: 'Add "Referrer-Policy: strict-origin-when-cross-origin" or "same-origin" header to control referrer information.',
          status: FindingStatus.OPEN
        });
      }

      // 7. Verificar Permissions Policy (Feature Policy)
      const permissionsPolicyCheck = this.checkPermissionsPolicy(httpHeaders);
      if (!permissionsPolicyCheck.valid) {
        findings.push({
          category: FindingCategory.WEB_SECURITY,
          severity: Severity.LOW,
          title: 'Permissions-Policy Header Missing',
          description: 'Missing Permissions-Policy header allows unrestricted use of browser features like camera, microphone, etc.',
          recommendation: 'Add Permissions-Policy header to restrict unnecessary browser features: "Permissions-Policy: camera=(), microphone=(), geolocation=self"',
          status: FindingStatus.OPEN
        });
      }

      // 8. Verificar Server header (información leak)
      const serverHeaderCheck = this.checkServerHeader(httpHeaders);
      if (!serverHeaderCheck.valid) {
        findings.push({
          category: FindingCategory.WEB_SECURITY,
          severity: Severity.LOW,
          title: 'Server Information Disclosure',
          description: serverHeaderCheck.description!,
          recommendation: 'Remove or obfuscate the Server header to avoid revealing server technology details.',
          status: FindingStatus.OPEN
        });
      }

      this.logger.log(`Security headers scan completed for ${domain}: ${findings.length} findings`);
      return findings;

    } catch (error) {
      this.logger.error(`Security headers scan failed for ${domain}:`, error);
      
      return [{
        category: FindingCategory.WEB_SECURITY,
        severity: Severity.MEDIUM,
        title: 'Security Headers Scan Failed',
        description: `Unable to complete security headers scan for ${domain}: ${error.message}`,
        recommendation: 'Verify that the domain is accessible and responds to HTTP requests.',
        status: FindingStatus.OPEN
      }];
    }
  }

  /**
   * Obtener headers de seguridad realizando request HTTP
   */
  private async getSecurityHeaders(domain: string): Promise<{
    success: boolean;
    headers?: any;
    error?: string;
  }> {
    try {
      // Intentar HTTPS primero, luego HTTP si falla
      const urls = [`https://${domain}`, `http://${domain}`];
      
      for (const url of urls) {
        try {
          const response = await axios.get(url, {
            timeout: 10000,
            validateStatus: () => true, // Aceptar cualquier status code
            maxRedirects: 5,
            headers: {
              'User-Agent': 'SecurityPYME-Scanner/1.0'
            }
          });

          return { success: true, headers: response.headers };
        } catch (urlError) {
          this.logger.debug(`Request failed for ${url}: ${(urlError as Error).message}`);
          continue;
        }
      }

      return { success: false, error: 'Unable to connect to domain via HTTP or HTTPS' };

    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * Verificar HSTS header
   */
  private checkHSTS(headers: any): { valid: boolean; severity?: Severity; description?: string } {
    const hsts = headers['strict-transport-security'] || headers['Strict-Transport-Security'];
    
    if (!hsts) {
      return {
        valid: false,
        severity: Severity.MEDIUM,
        description: 'HSTS header is missing. This allows downgrade attacks from HTTPS to HTTP.'
      };
    }

    // Verificar max-age
    if (!hsts.includes('max-age=')) {
      return {
        valid: false,
        severity: Severity.MEDIUM,
        description: 'HSTS header is present but missing max-age directive.'
      };
    }

    // Verificar que max-age sea suficiente (al menos 1 año)
    const maxAgeMatch = hsts.match(/max-age=(\d+)/);
    if (maxAgeMatch) {
      const maxAge = parseInt(maxAgeMatch[1]);
      if (maxAge < 31536000) { // 1 año en segundos
        return {
          valid: false,
          severity: Severity.LOW,
          description: 'HSTS max-age is too short. Recommended minimum is 1 year (31536000 seconds).'
        };
      }
    }

    return { valid: true };
  }

  /**
   * Verificar CSP header
   */
  private checkCSP(headers: any): { 
    valid: boolean; 
    severity?: Severity; 
    description?: string; 
    recommendation?: string;
  } {
    const csp = headers['content-security-policy'] || headers['Content-Security-Policy'];
    
    if (!csp) {
      return {
        valid: false,
        severity: Severity.MEDIUM,
        description: 'Content Security Policy header is missing, leaving the site vulnerable to XSS attacks.',
        recommendation: 'Implement a CSP header starting with "default-src \'self\'" and gradually refine it.'
      };
    }

    // Verificar directivas peligrosas
    if (csp.includes('\'unsafe-eval\'')) {
      return {
        valid: false,
        severity: Severity.MEDIUM,
        description: 'CSP contains \'unsafe-eval\' directive which allows dangerous eval() function usage.',
        recommendation: 'Remove \'unsafe-eval\' and refactor code to avoid eval() usage.'
      };
    }

    if (csp.includes('\'unsafe-inline\'') && !csp.includes('nonce-') && !csp.includes('sha256-')) {
      return {
        valid: false,
        severity: Severity.LOW,
        description: 'CSP contains \'unsafe-inline\' without nonce or hash, reducing XSS protection.',
        recommendation: 'Use nonces or hashes instead of \'unsafe-inline\' for better security.'
      };
    }

    return { valid: true };
  }

  /**
   * Verificar X-Frame-Options
   */
  private checkFrameOptions(headers: any): { valid: boolean } {
    const frameOptions = headers['x-frame-options'] || headers['X-Frame-Options'];
    return { valid: !!frameOptions };
  }

  /**
   * Verificar X-Content-Type-Options
   */
  private checkContentTypeOptions(headers: any): { valid: boolean } {
    const contentTypeOptions = headers['x-content-type-options'] || headers['X-Content-Type-Options'];
    return { valid: contentTypeOptions === 'nosniff' };
  }

  /**
   * Verificar X-XSS-Protection
   */
  private checkXSSProtection(headers: any): { valid: boolean; description?: string } {
    const xssProtection = headers['x-xss-protection'] || headers['X-XSS-Protection'];
    
    if (!xssProtection) {
      return { 
        valid: false, 
        description: 'X-XSS-Protection header is missing. While deprecated in favor of CSP, it still provides some protection in older browsers.' 
      };
    }

    if (xssProtection === '0') {
      return {
        valid: false,
        description: 'X-XSS-Protection is explicitly disabled with "0" value.'
      };
    }

    return { valid: true };
  }

  /**
   * Verificar Referrer Policy
   */
  private checkReferrerPolicy(headers: any): { valid: boolean } {
    const referrerPolicy = headers['referrer-policy'] || headers['Referrer-Policy'];
    return { valid: !!referrerPolicy };
  }

  /**
   * Verificar Permissions Policy
   */
  private checkPermissionsPolicy(headers: any): { valid: boolean } {
    const permissionsPolicy = headers['permissions-policy'] || headers['Permissions-Policy'] ||
                             headers['feature-policy'] || headers['Feature-Policy'];
    return { valid: !!permissionsPolicy };
  }

  /**
   * Verificar Server header
   */
  private checkServerHeader(headers: any): { valid: boolean; description?: string } {
    const server = headers['server'] || headers['Server'];
    
    if (!server) {
      return { valid: true }; // Es bueno no tener server header
    }

    // Verificar si revela información sensible
    const sensitiveInfo = ['Apache/', 'nginx/', 'Microsoft-IIS/', 'lighttpd/', 'Jetty/'];
    const hasSensitiveInfo = sensitiveInfo.some(info => server.includes(info));

    if (hasSensitiveInfo) {
      return {
        valid: false,
        description: `Server header reveals technology details: "${server}"`
      };
    }

    return { valid: true };
  }
}
