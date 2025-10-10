import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

// Enums locales (temporalmente hasta que solucionemos el path mapping)
export enum ScanStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
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

export enum SubscriptionPlan {
  TRIAL = 'TRIAL',
  STARTER = 'STARTER',
  GROWTH = 'GROWTH',
  PRO = 'PRO'
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  CANCELED = 'CANCELED',
  PAST_DUE = 'PAST_DUE',
  TRIALING = 'TRIALING'
}

export enum CompanyRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
  AUDITOR = 'AUDITOR',
  VIEWER = 'VIEWER'
}

export enum ReportFrequency {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY'
}

export enum ReportFormat {
  PDF = 'PDF',
  CSV = 'CSV',
  JSON = 'JSON'
}

// Registrar enums para GraphQL
registerEnumType(ScanStatus, { name: 'ScanStatus' });
registerEnumType(FindingCategory, { name: 'FindingCategory' });
registerEnumType(Severity, { name: 'Severity' });
registerEnumType(FindingStatus, { name: 'FindingStatus' });
registerEnumType(SubscriptionPlan, { name: 'SubscriptionPlan' });
registerEnumType(SubscriptionStatus, { name: 'SubscriptionStatus' });
registerEnumType(CompanyRole, { name: 'CompanyRole' });
registerEnumType(ReportFrequency, { name: 'ReportFrequency' });
registerEnumType(ReportFormat, { name: 'ReportFormat' });

@ObjectType()
export class User {
  @Field()
  id: string;

  @Field()
  email: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class UserSubscription {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field(() => SubscriptionPlan)
  plan: SubscriptionPlan;

  @Field(() => SubscriptionStatus)
  status: SubscriptionStatus;

  @Field({ nullable: true })
  stripeSubscriptionId?: string;

  @Field({ nullable: true })
  stripeCustomerId?: string;

  @Field()
  currentPeriodStart: Date;

  @Field()
  currentPeriodEnd: Date;

  @Field()
  cancelAtPeriodEnd: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class Company {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  domain: string;

  @Field()
  userId: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class Asset {
  @Field()
  id: string;

  @Field()
  domain: string;

  @Field()
  companyId: string;

  @Field()
  isActive: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class SecurityScan {
  @Field()
  id: string;

  @Field()
  companyId: string;

  @Field()
  domain: string;

  @Field(() => ScanStatus)
  status: ScanStatus;

  @Field()
  healthScore: number;

  @Field()
  startedAt: Date;

  @Field({ nullable: true })
  completedAt?: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class Finding {
  @Field()
  id: string;

  @Field()
  scanId: string;

  @Field(() => FindingCategory)
  category: FindingCategory;

  @Field(() => Severity)
  severity: Severity;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  recommendation: string;

  @Field(() => FindingStatus)
  status: FindingStatus;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class Task {
  @Field()
  id: string;

  @Field()
  findingId: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  isCompleted: boolean;

  @Field({ nullable: true })
  completedAt?: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class PlanLimits {
  @Field()
  id: string;

  @Field(() => SubscriptionPlan)
  plan: SubscriptionPlan;

  // Campos antiguos (compatibilidad temporal)
  @Field({ nullable: true })
  maxDomains?: number;

  @Field({ nullable: true })
  maxAssets?: number;

  // Campos nuevos (lógica clarificada)
  @Field({ nullable: true })
  maxCompanies?: number;

  @Field({ nullable: true })
  maxAssetsPerCompany?: number;

  @Field()
  scanFrequencyHours: number;

  @Field()
  hasSlackIntegration: boolean;

  @Field()
  hasTeamsIntegration: boolean;

  @Field()
  hasPDFReports: boolean;

  @Field()
  hasCSVReports: boolean;

  @Field()
  hasComplianceReports: boolean;

  @Field()
  hasAuditorAccess: boolean;

  @Field()
  hasPrioritySupport: boolean;

  @Field()
  hasHistoricalTrends: boolean;

  @Field()
  maxUsers: number;

  @Field()
  priceUsd: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class CompanyUser {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field()
  companyId: string;

  @Field(() => CompanyRole)
  role: CompanyRole;

  @Field({ nullable: true })
  invitedAt?: Date;

  @Field({ nullable: true })
  joinedAt?: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => User)
  user: User;

  @Field(() => Company)
  company: Company;
}

@ObjectType()
export class NotificationSetting {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field()
  companyId: string;

  @Field()
  emailAlerts: boolean;

  @Field({ nullable: true })
  slackWebhook?: string;

  @Field({ nullable: true })
  teamsWebhook?: string;

  @Field()
  criticalOnly: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class ScheduledReport {
  @Field()
  id: string;

  @Field()
  companyId: string;

  @Field(() => ReportFrequency)
  frequency: ReportFrequency;

  @Field(() => ReportFormat)
  format: ReportFormat;

  @Field()
  recipients: string;

  @Field()
  isActive: boolean;

  @Field({ nullable: true })
  lastSentAt?: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

// Security-related models
@ObjectType()
export class AssetRef {
  @Field()
  domain: string;
}

@ObjectType()
export class SecurityFinding {
  @Field()
  id: string;

  @Field()
  assetId: string;

  @Field(() => FindingCategory)
  category: FindingCategory;

  @Field(() => Severity)
  severity: Severity;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  recommendation: string;

  @Field(() => FindingStatus)
  status: FindingStatus;

  @Field(() => AssetRef)
  asset: AssetRef;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class SecurityScanResult {
  @Field()
  success: boolean;

  @Field({ nullable: true })
  scanId?: string;

  @Field()
  message: string;

  @Field()
  healthScore: number;

  @Field(() => [SecurityFinding])
  findings: SecurityFinding[];
}

@ObjectType()
export class SecurityScanStatus {
  @Field()
  id: string;

  @Field(() => ScanStatus)
  status: ScanStatus;

  @Field()
  healthScore: number;

  @Field(() => [SecurityFinding])
  findings: SecurityFinding[];

  @Field()
  domain: string;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  completedAt?: Date;
}

@ObjectType()
export class SecurityScanSummary {
  @Field()
  id: string;

  @Field()
  assetId: number;

  @Field()
  domain: string;

  @Field()
  healthScore: number;

  @Field()
  findingsCount: number;

  @Field()
  criticalFindings: number;

  @Field()
  highFindings: number;

  @Field()
  mediumFindings: number;

  @Field()
  lowFindings: number;

  @Field(() => ScanStatus)
  status: ScanStatus;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
