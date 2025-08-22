// Tipos principales del dominio
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
  companies: Company[];
}

export interface Company {
  id: string;
  name: string;
  domain: string;
  userId: string;
  user: User;
  assets: Asset[];
  scans: SecurityScan[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Asset {
  id: string;
  domain: string;
  companyId: string;
  company: Company;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Tipos de escaneo de seguridad
export interface SecurityScan {
  id: string;
  companyId: string;
  company: Company;
  status: ScanStatus;
  healthScore: number;
  findings: Finding[];
  startedAt: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum ScanStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export interface Finding {
  id: string;
  scanId: string;
  scan: SecurityScan;
  category: FindingCategory;
  severity: Severity;
  title: string;
  description: string;
  recommendation: string;
  status: FindingStatus;
  tasks: Task[];
  createdAt: Date;
  updatedAt: Date;
}

export enum FindingCategory {
  EMAIL_SECURITY = 'EMAIL_SECURITY',
  SSL_CERTIFICATE = 'SSL_CERTIFICATE',
  WEB_SECURITY = 'WEB_SECURITY',
  NETWORK_SECURITY = 'NETWORK_SECURITY'
}

export enum Severity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum FindingStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  IGNORED = 'IGNORED'
}

export interface Task {
  id: string;
  findingId: string;
  finding: Finding;
  title: string;
  description: string;
  isCompleted: boolean;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Tipos específicos de chequeos de seguridad
export interface EmailSecurityCheck {
  domain: string;
  spf: SPFRecord;
  dkim: DKIMRecord;
  dmarc: DMARCRecord;
}

export interface SPFRecord {
  exists: boolean;
  isValid: boolean;
  record?: string;
  mechanisms: string[];
  errors: string[];
}

export interface DKIMRecord {
  exists: boolean;
  isValid: boolean;
  selector?: string;
  record?: string;
  errors: string[];
}

export interface DMARCRecord {
  exists: boolean;
  isValid: boolean;
  policy?: DMARCPolicy;
  record?: string;
  errors: string[];
}

export enum DMARCPolicy {
  NONE = 'none',
  QUARANTINE = 'quarantine',
  REJECT = 'reject'
}

export interface SSLCheck {
  domain: string;
  isValid: boolean;
  expiryDate?: Date;
  daysUntilExpiry?: number;
  issuer?: string;
  errors: string[];
}

export interface WebSecurityCheck {
  domain: string;
  httpsRedirect: boolean;
  headers: SecurityHeaders;
}

export interface SecurityHeaders {
  hsts: boolean;
  csp: boolean;
  xFrameOptions: boolean;
  xContentTypeOptions: boolean;
  referrerPolicy: boolean;
}

export interface PortScanResult {
  port: number;
  protocol: 'TCP' | 'UDP';
  isOpen: boolean;
  service?: string;
  banner?: string;
}

// Tipos de autenticación
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// Tipos de suscripción y facturación
export interface Subscription {
  id: string;
  userId: string;
  user: User;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  stripeSubscriptionId?: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum SubscriptionPlan {
  TRIAL = 'TRIAL',
  STARTER = 'STARTER',
  PROFESSIONAL = 'PROFESSIONAL'
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  CANCELED = 'CANCELED',
  PAST_DUE = 'PAST_DUE',
  TRIALING = 'TRIALING'
}

// Constantes
export const SEVERITY_WEIGHTS = {
  [Severity.LOW]: 1,
  [Severity.MEDIUM]: 3,
  [Severity.HIGH]: 7,
  [Severity.CRITICAL]: 10
} as const;

export const COMMON_PORTS = [
  { port: 22, service: 'SSH' },
  { port: 25, service: 'SMTP' },
  { port: 53, service: 'DNS' },
  { port: 80, service: 'HTTP' },
  { port: 110, service: 'POP3' },
  { port: 143, service: 'IMAP' },
  { port: 443, service: 'HTTPS' },
  { port: 587, service: 'SMTP TLS' },
  { port: 993, service: 'IMAP SSL' },
  { port: 995, service: 'POP3 SSL' },
  { port: 3306, service: 'MySQL' },
  { port: 5432, service: 'PostgreSQL' },
  { port: 6379, service: 'Redis' },
  { port: 27017, service: 'MongoDB' }
] as const;
