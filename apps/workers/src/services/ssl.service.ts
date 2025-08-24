import * as tls from 'tls';
import * as net from 'net';
import { SSLResult } from '../types/scan-results';

export class SSLService {
  /**
   * Verifica el certificado SSL de un dominio
   */
  async checkSSLCertificate(domain: string, port: number = 443): Promise<SSLResult> {
    return new Promise((resolve) => {
      const options = {
        host: domain,
        port: port,
        servername: domain,
        rejectUnauthorized: false // Permitimos conexiones para analizar incluso certificados inválidos
      };

      const socket = tls.connect(options, () => {
        const cert = socket.getPeerCertificate(true);
        const cipher = socket.getCipher();
        
        if (!cert || Object.keys(cert).length === 0) {
          socket.destroy();
          resolve({
            domain,
            valid: false,
            issues: ['No certificate found or connection failed']
          });
          return;
        }

        const now = new Date();
        const expiresAt = new Date(cert.valid_to);
        const daysUntilExpiry = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        const issues: string[] = [];
        let valid = true;

        // Verificar si el certificado está expirado
        if (expiresAt < now) {
          issues.push('Certificate is expired');
          valid = false;
        }

        // Verificar si expira pronto (menos de 30 días)
        if (daysUntilExpiry <= 30 && daysUntilExpiry > 0) {
          issues.push(`Certificate expires in ${daysUntilExpiry} days`);
        }

        // Verificar si expira muy pronto (menos de 7 días)
        if (daysUntilExpiry <= 7 && daysUntilExpiry > 0) {
          valid = false;
        }

        // Verificar el algoritmo de cifrado
        if (cipher && cipher.name) {
          if (cipher.name.includes('RC4') || cipher.name.includes('DES')) {
            issues.push('Weak cipher suite detected');
            valid = false;
          }
        }

        // Verificar la versión del protocolo
        if (cipher && cipher.version) {
          if (cipher.version === 'TLSv1' || cipher.version === 'SSLv3' || cipher.version === 'SSLv2') {
            issues.push('Outdated TLS/SSL version');
            valid = false;
          }
        }

        // Verificar el nombre del certificado
        if (cert.subject && cert.subject.CN) {
          const certDomain = cert.subject.CN.toLowerCase();
          const checkDomain = domain.toLowerCase();
          
          if (certDomain !== checkDomain && !certDomain.startsWith('*.')) {
            // Verificar si es un wildcard que cubre el dominio
            if (certDomain.startsWith('*.')) {
              const wildcardBase = certDomain.substring(2);
              if (!checkDomain.endsWith(wildcardBase)) {
                issues.push('Certificate domain mismatch');
                valid = false;
              }
            } else {
              issues.push('Certificate domain mismatch');
              valid = false;
            }
          }
        }

        // Verificar autoridad certificadora
        let issuer = 'Unknown';
        if (cert.issuer && cert.issuer.CN) {
          issuer = cert.issuer.CN;
        } else if (cert.issuer && cert.issuer.O) {
          issuer = cert.issuer.O;
        }

        socket.destroy();
        
        resolve({
          domain,
          valid,
          expiresAt,
          daysUntilExpiry,
          issuer,
          issues: issues.length > 0 ? issues : undefined
        });
      });

      socket.on('error', (error) => {
        resolve({
          domain,
          valid: false,
          issues: [`SSL connection failed: ${error.message}`]
        });
      });

      // Timeout después de 10 segundos
      socket.setTimeout(10000, () => {
        socket.destroy();
        resolve({
          domain,
          valid: false,
          issues: ['SSL connection timeout']
        });
      });
    });
  }

  /**
   * Verifica si el sitio redirige HTTP a HTTPS
   */
  async checkHTTPSRedirect(domain: string): Promise<{ hasRedirect: boolean; issues: string[] }> {
    return new Promise((resolve) => {
      const issues: string[] = [];
      
      // Crear una conexión HTTP simple
      const socket = net.createConnection(80, domain);
      
      socket.on('connect', () => {
        const request = `GET / HTTP/1.1\r\nHost: ${domain}\r\nConnection: close\r\n\r\n`;
        socket.write(request);
      });

      socket.on('data', (data) => {
        const response = data.toString();
        socket.destroy();
        
        // Buscar redirección a HTTPS
        if (response.includes('301') || response.includes('302')) {
          if (response.toLowerCase().includes('https://')) {
            resolve({ hasRedirect: true, issues: [] });
          } else {
            issues.push('HTTP redirects but not to HTTPS');
            resolve({ hasRedirect: false, issues });
          }
        } else if (response.includes('200')) {
          issues.push('HTTP serves content without redirecting to HTTPS');
          resolve({ hasRedirect: false, issues });
        } else {
          issues.push('Unexpected HTTP response');
          resolve({ hasRedirect: false, issues });
        }
      });

      socket.on('error', (error) => {
        if (error.message.includes('ECONNREFUSED')) {
          // Si el puerto 80 está cerrado, es bueno - significa que solo sirve HTTPS
          resolve({ hasRedirect: true, issues: [] });
        } else {
          issues.push(`HTTP connection failed: ${error.message}`);
          resolve({ hasRedirect: false, issues });
        }
      });

      // Timeout después de 5 segundos
      socket.setTimeout(5000, () => {
        socket.destroy();
        issues.push('HTTP connection timeout');
        resolve({ hasRedirect: false, issues });
      });
    });
  }

  /**
   * Ejecuta todas las verificaciones SSL
   */
  async checkSSLSecurity(domain: string): Promise<SSLResult & { httpsRedirect: boolean; redirectIssues?: string[] }> {
    const [sslResult, redirectResult] = await Promise.all([
      this.checkSSLCertificate(domain),
      this.checkHTTPSRedirect(domain)
    ]);

    return {
      ...sslResult,
      httpsRedirect: redirectResult.hasRedirect,
      redirectIssues: redirectResult.issues.length > 0 ? redirectResult.issues : undefined
    };
  }
}
