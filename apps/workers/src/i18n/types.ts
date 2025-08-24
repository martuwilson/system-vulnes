export interface Messages {
  // DNS Security Messages
  dns: {
    starting: string;
    completed: string;
    spf: {
      missing: {
        title: string;
        description: string;
        recommendation: string;
      };
      invalid: {
        title: string;
        description: string;
        recommendation: string;
      };
    };
    dmarc: {
      missing: {
        title: string;
        description: string;
        recommendation: string;
      };
      permissive: {
        title: string;
        description: string;
        recommendation: string;
      };
    };
    dkim: {
      missing: {
        title: string;
        description: string;
        recommendation: string;
      };
    };
  };
  
  // SSL Certificate Messages
  ssl: {
    starting: string;
    completed: string;
    expired: {
      title: string;
      description: string;
      recommendation: string;
    };
    expiring: {
      title: string;
      description: (days: number) => string;
      recommendation: string;
    };
    domainMismatch: {
      title: string;
      description: string;
      recommendation: string;
    };
    weakConfig: {
      title: string;
      description: string;
      recommendation: string;
    };
    noHttpsRedirect: {
      title: string;
      description: string;
      recommendation: string;
    };
  };
  
  // General Messages
  general: {
    scanStarting: (domain: string) => string;
    scanResults: string;
    domain: string;
    overallScore: string;
    timestamp: string;
    individualScores: string;
    dnsSecurityDetails: string;
    sslCertificateDetails: string;
    securityFindings: string;
    noIssuesFound: string;
    scanFailed: (error: string) => string;
    
    // SSL Details
    validCertificate: string;
    httpsRedirect: string;
    expires: string;
    issuer: string;
    days: string;
  };
}

export type SupportedLanguage = 'en' | 'es';
