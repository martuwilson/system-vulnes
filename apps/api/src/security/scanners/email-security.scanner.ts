import { Injectable, Logger } from '@nestjs/common';
import { FindingCategory, Severity, FindingStatus } from '@prisma/client';
import { resolve4, resolveTxt } from 'dns';
import { promisify } from 'util';

const dns4 = promisify(resolve4);
const dnsTxt = promisify(resolveTxt);

export interface ScanFinding {
  category: FindingCategory;
  severity: Severity;
  title: string;
  description: string;
  recommendation: string;
  status: FindingStatus;
}

@Injectable()
export class EmailSecurityScanner {
  private readonly logger = new Logger(EmailSecurityScanner.name);

  async scan(domain: string): Promise<ScanFinding[]> {
    const findings: ScanFinding[] = [];
    
    this.logger.log(`Starting email security scan for domain: ${domain}`);

    try {
      // 1. Verificar SPF Record
      const spfResult = await this.checkSPFRecord(domain);
      if (!spfResult.valid) {
        findings.push({
          category: FindingCategory.EMAIL_SECURITY,
          severity: Severity.HIGH,
          title: 'SPF Record Missing or Invalid',
          description: `Domain ${domain} ${spfResult.error}. This makes the domain vulnerable to email spoofing attacks.`,
          recommendation: 'Configure a proper SPF record (e.g., "v=spf1 include:_spf.google.com ~all") to specify which servers are authorized to send emails from your domain.',
          status: FindingStatus.OPEN
        });
      }

      // 2. Verificar DKIM Records  
      const dkimResult = await this.checkDKIMRecord(domain);
      if (!dkimResult.valid) {
        findings.push({
          category: FindingCategory.EMAIL_SECURITY,
          severity: Severity.MEDIUM,
          title: 'DKIM Configuration Not Found',
          description: `Domain ${domain} does not have DKIM properly configured. ${dkimResult.error}`,
          recommendation: 'Configure DKIM signing for your email server. Contact your email provider for DKIM setup instructions.',
          status: FindingStatus.OPEN
        });
      }

      // 3. Verificar DMARC Policy
      const dmarcResult = await this.checkDMARCRecord(domain);
      if (!dmarcResult.valid) {
        findings.push({
          category: FindingCategory.EMAIL_SECURITY,
          severity: dmarcResult.severity || Severity.HIGH,
          title: 'DMARC Policy Issues',
          description: `Domain ${domain} ${dmarcResult.error}`,
          recommendation: dmarcResult.recommendation || 'Configure a DMARC policy starting with "p=none" to monitor email authentication, then gradually enforce with "p=quarantine" or "p=reject".',
          status: FindingStatus.OPEN
        });
      }

      this.logger.log(`Email security scan completed for ${domain}: ${findings.length} findings`);
      return findings;

    } catch (error) {
      this.logger.error(`Email security scan failed for ${domain}:`, error);
      
      return [{
        category: FindingCategory.EMAIL_SECURITY,
        severity: Severity.MEDIUM,
        title: 'Email Security Scan Failed',
        description: `Unable to complete email security scan for ${domain}: ${error.message}`,
        recommendation: 'Verify that the domain is properly configured and accessible.',
        status: FindingStatus.OPEN
      }];
    }
  }

  /**
   * Verificar SPF Record
   */
  private async checkSPFRecord(domain: string): Promise<{ valid: boolean; error?: string; record?: string }> {
    try {
      const txtRecords = await dnsTxt(domain);
      
      // Buscar registro SPF
      let spfRecord = '';
      for (const record of txtRecords) {
        const recordText = Array.isArray(record) ? record.join('') : record;
        if (recordText.startsWith('v=spf1')) {
          spfRecord = recordText;
          break;
        }
      }

      if (!spfRecord) {
        return { valid: false, error: 'does not have an SPF record configured' };
      }

      // Validaciones básicas del SPF
      if (!spfRecord.includes('~all') && !spfRecord.includes('-all') && !spfRecord.includes('+all')) {
        return { 
          valid: false, 
          error: 'has an SPF record but it does not end with a proper "all" mechanism',
          record: spfRecord
        };
      }

      // Si termina en +all es muy permisivo
      if (spfRecord.includes('+all')) {
        return { 
          valid: false, 
          error: 'has an overly permissive SPF record ending with "+all" which allows any server to send emails',
          record: spfRecord
        };
      }

      this.logger.debug(`Valid SPF record found for ${domain}: ${spfRecord}`);
      return { valid: true, record: spfRecord };

    } catch (error) {
      return { valid: false, error: `DNS lookup failed: ${error.message}` };
    }
  }

  /**
   * Verificar DKIM Records (busca selectores comunes)
   */
  private async checkDKIMRecord(domain: string): Promise<{ valid: boolean; error?: string; selectors?: string[] }> {
    const commonSelectors = [
      'default', 'google', 'gmail', 's1', 's2', 'k1', 'k2', 
      'dkim', 'mail', 'email', 'selector1', 'selector2'
    ];

    const foundSelectors: string[] = [];

    try {
      // Buscar DKIM en selectores comunes
      for (const selector of commonSelectors) {
        try {
          const dkimQuery = `${selector}._domainkey.${domain}`;
          const txtRecords = await dnsTxt(dkimQuery);
          
          if (txtRecords && txtRecords.length > 0) {
            const record = Array.isArray(txtRecords[0]) ? txtRecords[0].join('') : txtRecords[0];
            if (record.includes('v=DKIM1') || record.includes('k=rsa') || record.includes('p=')) {
              foundSelectors.push(selector);
              this.logger.debug(`DKIM record found for ${domain} with selector ${selector}`);
            }
          }
        } catch (selectorError) {
          // Selector no existe, continuar con el siguiente
          continue;
        }
      }

      if (foundSelectors.length === 0) {
        return { 
          valid: false, 
          error: 'No DKIM records found with common selectors. DKIM may not be configured.' 
        };
      }

      return { valid: true, selectors: foundSelectors };

    } catch (error) {
      return { valid: false, error: `DKIM lookup failed: ${error.message}` };
    }
  }

  /**
   * Verificar DMARC Record
   */
  private async checkDMARCRecord(domain: string): Promise<{ 
    valid: boolean; 
    error?: string; 
    record?: string;
    severity?: Severity;
    recommendation?: string;
  }> {
    try {
      const dmarcQuery = `_dmarc.${domain}`;
      const txtRecords = await dnsTxt(dmarcQuery);

      if (!txtRecords || txtRecords.length === 0) {
        return { 
          valid: false, 
          error: 'does not have a DMARC record configured',
          severity: Severity.HIGH,
          recommendation: 'Create a DMARC record starting with "v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com" to begin monitoring email authentication.'
        };
      }

      const dmarcRecord = Array.isArray(txtRecords[0]) ? txtRecords[0].join('') : txtRecords[0];

      if (!dmarcRecord.startsWith('v=DMARC1')) {
        return { 
          valid: false, 
          error: 'has an invalid DMARC record that does not start with "v=DMARC1"',
          record: dmarcRecord,
          severity: Severity.HIGH
        };
      }

      // Analizar política DMARC
      const policyMatch = dmarcRecord.match(/p=([^;]+)/);
      const policy = policyMatch ? policyMatch[1].trim() : '';

      // Verificar si tiene configuración de reportes
      const hasRua = dmarcRecord.includes('rua=');
      const hasRuf = dmarcRecord.includes('ruf=');

      if (policy === 'none' && !hasRua && !hasRuf) {
        return {
          valid: false,
          error: 'has a DMARC record with policy "none" but no reporting configured (rua/ruf)',
          record: dmarcRecord,
          severity: Severity.MEDIUM,
          recommendation: 'Add reporting configuration to your DMARC record (rua=mailto:dmarc@yourdomain.com) to receive alignment reports.'
        };
      }

      if (policy === 'none') {
        return {
          valid: false,
          error: 'has a DMARC record but policy is set to "none" which provides no protection',
          record: dmarcRecord,
          severity: Severity.MEDIUM,
          recommendation: 'After monitoring with "p=none", upgrade to "p=quarantine" and eventually "p=reject" for better protection.'
        };
      }

      this.logger.debug(`Valid DMARC record found for ${domain}: ${dmarcRecord}`);
      return { valid: true, record: dmarcRecord };

    } catch (error) {
      return { 
        valid: false, 
        error: `DMARC lookup failed: ${error.message}`,
        severity: Severity.MEDIUM
      };
    }
  }
}
