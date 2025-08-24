import { DNSSecurityWorker } from './workers/dns-security.worker';
import { SSLCertificateWorker } from './workers/ssl-certificate.worker';
import { WebSecurityWorker } from './workers/web-security.worker';
import { i18n } from './i18n';

export class SecurityWorker {
  private dnsWorker: DNSSecurityWorker;
  private sslWorker: SSLCertificateWorker;
  private webSecurityWorker: WebSecurityWorker;

  constructor() {
    this.dnsWorker = new DNSSecurityWorker();
    this.sslWorker = new SSLCertificateWorker();
    this.webSecurityWorker = new WebSecurityWorker();
  }

  /**
   * Ejecuta un escaneo completo de seguridad para un dominio
   */
  async scanDomain(domain: string, language: 'en' | 'es' = 'en') {
    try {
      // Configurar idioma
      i18n.setLanguage(language);
      const messages = i18n.getMessages();
      
      console.log(messages.general.scanStarting(domain));
      
      const [dnsResults, sslResults, webSecurityResults] = await Promise.all([
        this.dnsWorker.scanDNSSecurity(domain),
        this.sslWorker.scanSSLSecurity(domain),
        this.webSecurityWorker.scanWebSecurity(domain)
      ]);
      
      // Combinar findings de todos los scanners
      const allFindings = [
        ...dnsResults.findings, 
        ...sslResults.findings,
        ...webSecurityResults.findings
      ];
      
      // Calcular score promedio ponderado
      const overallScore = Math.round(
        (dnsResults.score + sslResults.score + webSecurityResults.score) / 3
      );
      
      return {
        domain,
        timestamp: new Date(),
        overallScore,
        findings: allFindings,
        details: {
          dns: dnsResults.result,
          ssl: sslResults.result,
          webSecurity: webSecurityResults.result
        },
        scores: {
          dns: dnsResults.score,
          ssl: sslResults.score,
          webSecurity: webSecurityResults.score,
          overall: overallScore
        }
      };
    } catch (error: any) {
      console.error(`Error scanning domain ${domain}:`, error);
      throw new Error(`Failed to scan domain: ${error.message}`);
    }
  }
}

// Ejemplo de uso / testing con soporte de idiomas
async function testScan() {
  if (process.argv.length < 3) {
    console.log('Usage: npm run test -- <domain> [language]');
    console.log('Example: npm run test -- example.com es');
    console.log('Languages: en (English), es (Español)');
    process.exit(1);
  }

  const domain = process.argv[2];
  const language = (process.argv[3] as 'en' | 'es') || 'en';
  
  // Configurar idioma
  i18n.setLanguage(language);
  const messages = i18n.getMessages();
  
  const worker = new SecurityWorker();

  try {
    const result = await worker.scanDomain(domain, language);
    
    console.log(`\n${messages.general.scanResults}`);
    console.log('='.repeat(50));
    console.log(`${messages.general.domain}: ${result.domain}`);
    console.log(`${messages.general.overallScore}: ${result.overallScore}/100`);
    console.log(`${messages.general.timestamp}: ${result.timestamp}`);
    
    console.log(`\n${messages.general.individualScores}:`);
    console.log(`- DNS Security: ${result.scores.dns}/100`);
    console.log(`- SSL Certificate: ${result.scores.ssl}/100`);
    console.log(`- Web Security: ${result.scores.webSecurity}/100`);
    console.log(`- ${messages.general.overallScore}: ${result.scores.overall}/100`);
    
    console.log(`\n${messages.general.dnsSecurityDetails}:`);
    console.log(`- SPF: ${result.details.dns.spf.exists ? '✅' : '❌'} ${result.details.dns.spf.exists ? '(Valid: ' + result.details.dns.spf.valid + ')' : ''}`);
    console.log(`- DKIM: ${result.details.dns.dkim.configured ? '✅' : '❌'} ${result.details.dns.dkim.configured ? '(Selectors: ' + (result.details.dns.dkim.selectors || []).join(', ') + ')' : ''}`);
    console.log(`- DMARC: ${result.details.dns.dmarc.exists ? '✅' : '❌'} ${result.details.dns.dmarc.exists ? '(Policy: ' + result.details.dns.dmarc.policy + ')' : ''}`);
    
    console.log(`\n${messages.general.sslCertificateDetails}:`);
    console.log(`- ${messages.general.validCertificate}: ${result.details.ssl.valid ? '✅' : '❌'}`);
    console.log(`- ${messages.general.httpsRedirect}: ${result.details.ssl.httpsRedirect ? '✅' : '❌'}`);
    if (result.details.ssl.expiresAt) {
      console.log(`- ${messages.general.expires}: ${result.details.ssl.expiresAt.toLocaleDateString()} (${result.details.ssl.daysUntilExpiry} ${messages.general.days})`);
    }
    if (result.details.ssl.issuer) {
      console.log(`- ${messages.general.issuer}: ${result.details.ssl.issuer}`);
    }

    console.log(`\n🌐 ${messages.general.webSecurityDetails}:`);
    console.log(`- HTTPS Redirect: ${result.details.webSecurity.httpsRedirect ? '✅' : '❌'}`);
    console.log(`- HSTS Header: ${result.details.webSecurity.headers.hsts ? '✅' : '❌'}`);
    console.log(`- CSP Header: ${result.details.webSecurity.headers.csp ? '✅' : '❌'}`);
    console.log(`- X-Frame-Options: ${result.details.webSecurity.headers.xFrameOptions ? '✅' : '❌'}`);
    console.log(`- X-Content-Type-Options: ${result.details.webSecurity.headers.xContentTypeOptions ? '✅' : '❌'}`);
    console.log(`- X-XSS-Protection: ${result.details.webSecurity.headers.xXSSProtection ? '✅' : '❌'}`);
    
    if (result.findings.length > 0) {
      console.log(`\n${messages.general.securityFindings}:`);
      result.findings.forEach((finding, index) => {
        console.log(`\n${index + 1}. ${finding.title} (${finding.severity})`);
        console.log(`   ${finding.description}`);
        console.log(`   💡 Recommendation: ${finding.recommendation}`);
      });
    } else {
      console.log(`\n${messages.general.noIssuesFound}`);
    }

  } catch (error: any) {
    const messages = i18n.getMessages();
    console.error(`\n${messages.general.scanFailed(error.message)}`);
    process.exit(1);
  }
}

// Solo ejecutar test si es llamado directamente
if (require.main === module) {
  testScan();
}
