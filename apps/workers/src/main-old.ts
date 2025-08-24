import { DNSSecurityWorker } from './workers/dns-security.worker';
import { SSLCertificateWorker } from './workers/ssl-certificate.worker';
import { i18n } from './i18n';

export class SecurityWorker {
  private dnsWorker: DNSSecurityWorker;
  private sslWorker: SSLCertificateWorker;

  constructor() {
    this.dnsWorker = new DNSSecurityWorker();
    this.sslWorker = new SSLCertificateWorker();
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
      
      const [dnsResults, sslResults] = await Promise.all([
        this.dnsWorker.scanDNSSecurity(domain),
        this.sslWorker.scanSSLSecurity(domain)
      ]);
      
      // Combinar findings de ambos scanners
      const allFindings = [...dnsResults.findings, ...sslResults.findings];
      
      // Calcular score promedio ponderado
      const overallScore = Math.round((dnsResults.score + sslResults.score) / 2);
      
      return {
        domain,
        timestamp: new Date(),
        overallScore,
        findings: allFindings,
        details: {
          dns: dnsResults.result,
          ssl: sslResults.result
        },
        scores: {
          dns: dnsResults.score,
          ssl: sslResults.score,
          overall: overallScore
        }
      };
    } catch (error: any) {
      console.error(`Error scanning domain ${domain}:`, error);
      throw new Error(`Failed to scan domain: ${error.message}`);
    }
  }
}

// Ejemplo de uso / testing
async function testScan() {
  if (process.argv.length < 3) {
    console.log('Usage: npm run test -- <domain>');
    console.log('Example: npm run test -- example.com');
    process.exit(1);
  }

  const domain = process.argv[2];
  const worker = new SecurityWorker();

  try {
    console.log(`🚀 Starting security scan for: ${domain}`);
    const result = await worker.scanDomain(domain);
    
    console.log('\n📊 SCAN RESULTS');
    console.log('='.repeat(50));
    console.log(`Domain: ${result.domain}`);
    console.log(`Overall Score: ${result.overallScore}/100`);
    console.log(`Timestamp: ${result.timestamp}`);
    
    console.log('\n� Individual Scores:');
    console.log(`- DNS Security: ${result.scores.dns}/100`);
    console.log(`- SSL Certificate: ${result.scores.ssl}/100`);
    
    console.log('\n�🔍 DNS Security Details:');
    console.log(`- SPF: ${result.details.dns.spf.exists ? '✅' : '❌'} ${result.details.dns.spf.exists ? '(Valid: ' + result.details.dns.spf.valid + ')' : ''}`);
    console.log(`- DKIM: ${result.details.dns.dkim.configured ? '✅' : '❌'} ${result.details.dns.dkim.configured ? '(Selectors: ' + (result.details.dns.dkim.selectors || []).join(', ') + ')' : ''}`);
    console.log(`- DMARC: ${result.details.dns.dmarc.exists ? '✅' : '❌'} ${result.details.dns.dmarc.exists ? '(Policy: ' + result.details.dns.dmarc.policy + ')' : ''}`);
    
    console.log('\n🔒 SSL Certificate Details:');
    console.log(`- Valid Certificate: ${result.details.ssl.valid ? '✅' : '❌'}`);
    console.log(`- HTTPS Redirect: ${result.details.ssl.httpsRedirect ? '✅' : '❌'}`);
    if (result.details.ssl.expiresAt) {
      console.log(`- Expires: ${result.details.ssl.expiresAt.toLocaleDateString()} (${result.details.ssl.daysUntilExpiry} days)`);
    }
    if (result.details.ssl.issuer) {
      console.log(`- Issuer: ${result.details.ssl.issuer}`);
    }
    
    if (result.findings.length > 0) {
      console.log('\n⚠️  SECURITY FINDINGS:');
      result.findings.forEach((finding, index) => {
        console.log(`\n${index + 1}. ${finding.title} (${finding.severity})`);
        console.log(`   ${finding.description}`);
        console.log(`   💡 Recommendation: ${finding.recommendation}`);
      });
    } else {
      console.log('\n🎉 No security issues found!');
    }

  } catch (error: any) {
    console.error('\n❌ Scan failed:', error.message);
    process.exit(1);
  }
}

// Solo ejecutar test si es llamado directamente
if (require.main === module) {
  testScan();
}
