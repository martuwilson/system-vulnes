export interface ScanResult {
  category: 'EMAIL_SECURITY' | 'SSL_CERTIFICATE' | 'WEB_SECURITY' | 'NETWORK_SECURITY';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  description: string;
  recommendation: string;
  score: number; // 0-100, donde 100 es perfecto
  details?: Record<string, any>;
}

export interface DNSSecurityResult {
  domain: string;
  spf: {
    exists: boolean;
    record?: string;
    valid: boolean;
    issues?: string[];
  };
  dkim: {
    configured: boolean;
    selectors?: string[];
    issues?: string[];
  };
  dmarc: {
    exists: boolean;
    policy?: 'none' | 'quarantine' | 'reject' | string;
    record?: string;
    issues?: string[];
  };
}

export interface SSLResult {
  domain: string;
  valid: boolean;
  expiresAt?: Date;
  daysUntilExpiry?: number;
  issuer?: string;
  issues?: string[];
}

export interface WebSecurityResult {
  domain: string;
  httpsRedirect: boolean;
  headers: {
    hsts: boolean;
    csp: boolean;
    xFrameOptions: boolean;
    xContentTypeOptions: boolean;
    xXSSProtection: boolean;
  };
  issues?: string[];
}

export interface PortScanResult {
  domain: string;
  openPorts: number[];
  closedPorts: number[];
  commonPorts: {
    port: number;
    service: string;
    status: 'open' | 'closed' | 'filtered';
  }[];
}

export interface CompleteScanResult {
  domain: string;
  scanId: string;
  timestamp: Date;
  overallScore: number;
  dns?: DNSSecurityResult;
  ssl?: SSLResult;
  webSecurity?: WebSecurityResult;
  portScan?: PortScanResult;
  findings: ScanResult[];
}
