import { promises as dns } from 'dns';
import { DNSSecurityResult } from '../types/scan-results';

export class DNSService {
  /**
   * Verifica SPF record para el dominio
   */
  async checkSPF(domain: string): Promise<{ exists: boolean; record?: string; valid: boolean; issues: string[] }> {
    const issues: string[] = [];
    
    try {
      const txtRecords = await dns.resolveTxt(domain);
      const spfRecord = txtRecords.find((record: string[]) => 
        record.some((part: string) => part.toLowerCase().startsWith('v=spf1'))
      );

      if (!spfRecord) {
        return {
          exists: false,
          valid: false,
          issues: ['No SPF record found. This allows email spoofing.']
        };
      }

      const spfString = spfRecord.join('');
      
      // Validaciones básicas de SPF
      if (!spfString.includes('~all') && !spfString.includes('-all')) {
        issues.push('SPF record should end with ~all or -all for better security');
      }

      if (spfString.includes('+all')) {
        issues.push('SPF record contains +all which allows any server to send emails');
      }

      return {
        exists: true,
        record: spfString,
        valid: issues.length === 0,
        issues
      };

    } catch (error: any) {
      return {
        exists: false,
        valid: false,
        issues: [`Error checking SPF record: ${error?.message || 'Unknown error'}`]
      };
    }
  }

  /**
   * Verifica DMARC record para el dominio
   */
  async checkDMARC(domain: string): Promise<{ exists: boolean; policy?: string; record?: string; issues: string[] }> {
    const issues: string[] = [];
    
    try {
      const dmarcDomain = `_dmarc.${domain}`;
      const txtRecords = await dns.resolveTxt(dmarcDomain);
      
      const dmarcRecord = txtRecords.find((record: string[]) => 
        record.some((part: string) => part.toLowerCase().startsWith('v=dmarc1'))
      );

      if (!dmarcRecord) {
        return {
          exists: false,
          issues: ['No DMARC record found. Email spoofing protection is disabled.']
        };
      }

      const dmarcString = dmarcRecord.join('');
      
      // Extraer política
      const policyMatch = dmarcString.match(/p=([^;]+)/);
      const policyValue = policyMatch ? policyMatch[1].trim() : 'none';
      const policy = ['none', 'quarantine', 'reject'].includes(policyValue) 
        ? policyValue as 'none' | 'quarantine' | 'reject' 
        : 'none';

      if (policy === 'none') {
        issues.push('DMARC policy is set to "none". Consider upgrading to "quarantine" or "reject".');
      }

      return {
        exists: true,
        policy,
        record: dmarcString,
        issues
      };

    } catch (error: any) {
      return {
        exists: false,
        issues: [`Error checking DMARC record: ${error?.message || 'Unknown error'}`]
      };
    }
  }

  /**
   * Verifica DKIM configuración (básico - busca selectores comunes)
   */
  async checkDKIM(domain: string): Promise<{ configured: boolean; selectors: string[]; issues: string[] }> {
    const commonSelectors = ['default', 'selector1', 'selector2', 'google', 'k1', 's1'];
    const foundSelectors: string[] = [];
    const issues: string[] = [];

    for (const selector of commonSelectors) {
      try {
        const dkimDomain = `${selector}._domainkey.${domain}`;
        const txtRecords = await dns.resolveTxt(dkimDomain);
        
        const dkimRecord = txtRecords.find((record: string[]) => 
          record.some((part: string) => part.toLowerCase().includes('v=dkim1'))
        );

        if (dkimRecord) {
          foundSelectors.push(selector);
        }
      } catch (error) {
        // Ignoramos errores - es normal que no existan todos los selectores
      }
    }

    if (foundSelectors.length === 0) {
      issues.push('No DKIM records found with common selectors. Email authentication may be weak.');
    }

    return {
      configured: foundSelectors.length > 0,
      selectors: foundSelectors,
      issues
    };
  }

  /**
   * Ejecuta todas las verificaciones DNS de seguridad
   */
  async checkDNSSecurity(domain: string): Promise<DNSSecurityResult> {
    const [spf, dmarc, dkim] = await Promise.all([
      this.checkSPF(domain),
      this.checkDMARC(domain),
      this.checkDKIM(domain)
    ]);

    return {
      domain,
      spf,
      dkim,
      dmarc
    };
  }
}
