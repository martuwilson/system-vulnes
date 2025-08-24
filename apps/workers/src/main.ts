import { DNSSecurityWorker } from './workers/dns-security.worker';

export class SecurityWorker {
  private dnsWorker: DNSSecurityWorker;

  constructor() {
    this.dnsWorker = new DNSSecurityWorker();
  }

  /**
   * Ejecuta un escaneo completo de DNS security para un dominio
   */
  async scanDomain(domain: string) {
    try {
      const dnsResults = await this.dnsWorker.scanDNSSecurity(domain);
      
      return {
        domain,
        timestamp: new Date(),
        overallScore: dnsResults.score,
        findings: dnsResults.findings,
        details: {
          dns: dnsResults.result
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
    
    console.log('\n🔍 DNS Security Details:');
    console.log(`- SPF: ${result.details.dns.spf.exists ? '✅' : '❌'} ${result.details.dns.spf.exists ? '(Valid: ' + result.details.dns.spf.valid + ')' : ''}`);
    console.log(`- DKIM: ${result.details.dns.dkim.configured ? '✅' : '❌'} ${result.details.dns.dkim.configured ? '(Selectors: ' + (result.details.dns.dkim.selectors || []).join(', ') + ')' : ''}`);
    console.log(`- DMARC: ${result.details.dns.dmarc.exists ? '✅' : '❌'} ${result.details.dns.dmarc.exists ? '(Policy: ' + result.details.dns.dmarc.policy + ')' : ''}`);
    
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
