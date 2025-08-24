import * as https from 'https';
import * as http from 'http';
import { WebSecurityResult } from '../types/scan-results';

export class WebSecurityService {
  /**
   * Verifica los headers de seguridad de un dominio
   */
  async checkSecurityHeaders(domain: string): Promise<WebSecurityResult> {
    return new Promise((resolve) => {
      const options = {
        hostname: domain,
        port: 443,
        path: '/',
        method: 'HEAD',
        timeout: 10000,
        headers: {
          'User-Agent': 'SecurityPyme-Scanner/1.0'
        }
      };

      const req = https.request(options, (res) => {
        const headers = res.headers;
        const securityHeaders = this.analyzeHeaders(headers);
        
        resolve({
          domain,
          httpsRedirect: true, // Si llegamos aquí via HTTPS, asumimos que hay redirect
          headers: securityHeaders,
          issues: this.generateHeaderIssues(securityHeaders)
        });
      });

      req.on('error', (error) => {
        // Si falla HTTPS, intentar HTTP
        this.checkHTTPHeaders(domain).then(resolve);
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({
          domain,
          httpsRedirect: false,
          headers: {
            hsts: false,
            csp: false,
            xFrameOptions: false,
            xContentTypeOptions: false,
            xXSSProtection: false
          },
          issues: ['Connection timeout - unable to analyze headers']
        });
      });

      req.end();
    });
  }

  /**
   * Fallback para verificar headers via HTTP si HTTPS falla
   */
  private async checkHTTPHeaders(domain: string): Promise<WebSecurityResult> {
    return new Promise((resolve) => {
      const options = {
        hostname: domain,
        port: 80,
        path: '/',
        method: 'HEAD',
        timeout: 10000,
        headers: {
          'User-Agent': 'SecurityPyme-Scanner/1.0'
        }
      };

      const req = http.request(options, (res) => {
        const headers = res.headers;
        const securityHeaders = this.analyzeHeaders(headers);
        
        // Verificar si hay redirección a HTTPS
        const location = headers.location as string;
        const httpsRedirect = !!(location && location.startsWith('https://'));
        
        resolve({
          domain,
          httpsRedirect,
          headers: securityHeaders,
          issues: this.generateHeaderIssues(securityHeaders, !httpsRedirect)
        });
      });

      req.on('error', (error) => {
        resolve({
          domain,
          httpsRedirect: false,
          headers: {
            hsts: false,
            csp: false,
            xFrameOptions: false,
            xContentTypeOptions: false,
            xXSSProtection: false
          },
          issues: [`Unable to connect: ${error.message}`]
        });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({
          domain,
          httpsRedirect: false,
          headers: {
            hsts: false,
            csp: false,
            xFrameOptions: false,
            xContentTypeOptions: false,
            xXSSProtection: false
          },
          issues: ['Connection timeout - unable to analyze headers']
        });
      });

      req.end();
    });
  }

  /**
   * Analiza los headers HTTP y determina qué headers de seguridad están presentes
   */
  private analyzeHeaders(headers: http.IncomingHttpHeaders): {
    hsts: boolean;
    csp: boolean;
    xFrameOptions: boolean;
    xContentTypeOptions: boolean;
    xXSSProtection: boolean;
  } {
    return {
      hsts: !!(headers['strict-transport-security']),
      csp: !!(headers['content-security-policy']),
      xFrameOptions: !!(headers['x-frame-options']),
      xContentTypeOptions: !!(headers['x-content-type-options']),
      xXSSProtection: !!(headers['x-xss-protection'])
    };
  }

  /**
   * Genera una lista de problemas basados en los headers faltantes
   */
  private generateHeaderIssues(
    headers: {
      hsts: boolean;
      csp: boolean;
      xFrameOptions: boolean;
      xContentTypeOptions: boolean;
      xXSSProtection: boolean;
    },
    noHttpsRedirect: boolean = false
  ): string[] {
    const issues: string[] = [];

    if (noHttpsRedirect) {
      issues.push('No HTTPS redirect detected');
    }

    if (!headers.hsts) {
      issues.push('Missing HSTS header - connections vulnerable to downgrade attacks');
    }

    if (!headers.csp) {
      issues.push('Missing Content Security Policy - vulnerable to XSS attacks');
    }

    if (!headers.xFrameOptions) {
      issues.push('Missing X-Frame-Options header - vulnerable to clickjacking');
    }

    if (!headers.xContentTypeOptions) {
      issues.push('Missing X-Content-Type-Options header - vulnerable to MIME sniffing');
    }

    if (!headers.xXSSProtection) {
      issues.push('Missing X-XSS-Protection header - no XSS filtering');
    }

    return issues;
  }

  /**
   * Verifica headers de seguridad específicos con más detalle
   */
  async checkDetailedHeaders(domain: string): Promise<{
    hstsDetails?: { maxAge?: number; includeSubdomains: boolean; preload: boolean };
    cspDetails?: { hasUnsafeInline: boolean; hasUnsafeEval: boolean; policies: string[] };
    frameOptionsDetails?: { value: string; secure: boolean };
  }> {
    return new Promise((resolve) => {
      const options = {
        hostname: domain,
        port: 443,
        path: '/',
        method: 'HEAD',
        timeout: 10000
      };

      const req = https.request(options, (res) => {
        const headers = res.headers;
        const details: any = {};

        // Analizar HSTS en detalle
        const hsts = headers['strict-transport-security'] as string;
        if (hsts) {
          const maxAgeMatch = hsts.match(/max-age=(\d+)/);
          details.hstsDetails = {
            maxAge: maxAgeMatch ? parseInt(maxAgeMatch[1]) : undefined,
            includeSubdomains: hsts.includes('includeSubDomains'),
            preload: hsts.includes('preload')
          };
        }

        // Analizar CSP en detalle
        const csp = headers['content-security-policy'] as string;
        if (csp) {
          details.cspDetails = {
            hasUnsafeInline: csp.includes("'unsafe-inline'"),
            hasUnsafeEval: csp.includes("'unsafe-eval'"),
            policies: csp.split(';').map(p => p.trim()).filter(p => p.length > 0)
          };
        }

        // Analizar X-Frame-Options en detalle
        const frameOptions = headers['x-frame-options'] as string;
        if (frameOptions) {
          details.frameOptionsDetails = {
            value: frameOptions.toLowerCase(),
            secure: frameOptions.toLowerCase() === 'deny' || frameOptions.toLowerCase() === 'sameorigin'
          };
        }

        resolve(details);
      });

      req.on('error', () => {
        resolve({});
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({});
      });

      req.end();
    });
  }
}
