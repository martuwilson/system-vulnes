import { Messages } from './types';

export const enMessages: Messages = {
  dns: {
    starting: '🔍 Starting DNS security scan for:',
    completed: '✅ DNS scan completed for',
    spf: {
      missing: {
        title: 'SPF Record Missing',
        description: 'No SPF record found for this domain. This allows attackers to easily spoof emails from your domain.',
        recommendation: 'Create an SPF record in your DNS settings. Start with "v=spf1 include:_spf.google.com ~all" if using Google Workspace.'
      },
      invalid: {
        title: 'SPF Configuration Issue',
        description: 'SPF record has configuration issues that may affect email security.',
        recommendation: 'Review and update your SPF record to follow best practices.'
      }
    },
    dmarc: {
      missing: {
        title: 'DMARC Record Missing',
        description: 'No DMARC record found. Your domain is vulnerable to email spoofing and phishing attacks.',
        recommendation: 'Implement a DMARC record starting with "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com"'
      },
      permissive: {
        title: 'DMARC Policy Too Permissive',
        description: 'DMARC policy is set to "none", which provides monitoring but no protection against spoofing.',
        recommendation: 'Upgrade DMARC policy to "quarantine" or "reject" for better email security.'
      }
    },
    dkim: {
      missing: {
        title: 'DKIM Not Configured',
        description: 'No DKIM records found with common selectors. Email authentication may be incomplete.',
        recommendation: 'Configure DKIM signing with your email provider to improve email deliverability and security.'
      }
    }
  },
  
  ssl: {
    starting: '🔒 Starting SSL security scan for:',
    completed: '✅ SSL scan completed for',
    expired: {
      title: 'SSL Certificate Expired',
      description: 'The SSL certificate for this domain has expired. Users will see security warnings.',
      recommendation: 'Renew your SSL certificate immediately through your hosting provider or certificate authority.'
    },
    expiring: {
      title: 'SSL Certificate Expiring Soon',
      description: (days: number) => `SSL certificate expires in ${days} days. Plan renewal to avoid service interruption.`,
      recommendation: 'Set up automatic certificate renewal or manually renew before expiration.'
    },
    domainMismatch: {
      title: 'SSL Certificate Domain Mismatch',
      description: 'The SSL certificate is not valid for this domain name.',
      recommendation: 'Install a certificate that matches your domain name or use a wildcard certificate.'
    },
    weakConfig: {
      title: 'Weak SSL/TLS Configuration',
      description: 'The server is using outdated or weak SSL/TLS protocols or cipher suites.',
      recommendation: 'Update your server configuration to use TLS 1.2 or 1.3 with strong cipher suites.'
    },
    noHttpsRedirect: {
      title: 'Missing HTTPS Redirect',
      description: 'The website does not redirect HTTP traffic to HTTPS.',
      recommendation: 'Configure your web server to automatically redirect all HTTP traffic to HTTPS.'
    }
  },
  
  general: {
    scanStarting: (domain: string) => `🚀 Starting comprehensive security scan for: ${domain}`,
    scanResults: '📊 SCAN RESULTS',
    domain: 'Domain',
    overallScore: 'Overall Score',
    timestamp: 'Timestamp',
    individualScores: '📈 Individual Scores',
    dnsSecurityDetails: '🔍 DNS Security Details',
    sslCertificateDetails: '🔒 SSL Certificate Details',
    securityFindings: '⚠️  SECURITY FINDINGS',
    noIssuesFound: '🎉 No security issues found!',
    scanFailed: (error: string) => `❌ Scan failed: ${error}`,
    
    validCertificate: 'Valid Certificate',
    httpsRedirect: 'HTTPS Redirect',
    expires: 'Expires',
    issuer: 'Issuer',
    days: 'days'
  }
};
