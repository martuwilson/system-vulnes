// Utilidades para cálculo de health score
import { Finding, Severity, SEVERITY_WEIGHTS } from './types';

export function calculateHealthScore(findings: Finding[]): number {
  if (findings.length === 0) return 100;

  const totalWeight = findings.reduce((sum, finding) => {
    return sum + SEVERITY_WEIGHTS[finding.severity];
  }, 0);

  // Escala logarítmica para evitar que muchos hallazgos bajen demasiado el score
  const score = Math.max(0, 100 - Math.min(100, totalWeight * 2));
  return Math.round(score);
}

export function getScoreColor(score: number): string {
  if (score >= 80) return '#4caf50'; // Verde
  if (score >= 60) return '#ff9800'; // Naranja
  if (score >= 40) return '#f44336'; // Rojo
  return '#9c27b0'; // Morado (crítico)
}

export function getScoreLabel(score: number): string {
  if (score >= 80) return 'Excelente';
  if (score >= 60) return 'Bueno';
  if (score >= 40) return 'Regular';
  return 'Crítico';
}

// Utilidades de validación
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidDomain(domain: string): boolean {
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9])*$/;
  return domainRegex.test(domain);
}

// Utilidades de formateo
export function formatSeverity(severity: Severity): string {
  const severityMap = {
    [Severity.LOW]: 'Bajo',
    [Severity.MEDIUM]: 'Medio',
    [Severity.HIGH]: 'Alto',
    [Severity.CRITICAL]: 'Crítico'
  };
  return severityMap[severity];
}

export function formatFindingCategory(category: string): string {
  const categoryMap: Record<string, string> = {
    EMAIL_SECURITY: 'Seguridad de Email',
    SSL_CERTIFICATE: 'Certificado SSL',
    WEB_SECURITY: 'Seguridad Web',
    NETWORK_SECURITY: 'Seguridad de Red'
  };
  return categoryMap[category] || category;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('es-AR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Utilidades de tiempo
export function getDaysUntilExpiry(expiryDate: Date): number {
  const now = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function isExpiringSoon(expiryDate: Date, warningDays: number = 30): boolean {
  return getDaysUntilExpiry(expiryDate) <= warningDays;
}

// Utilidades de API
export function createApiError(message: string, code?: string): Error {
  const error = new Error(message);
  (error as any).code = code;
  return error;
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Constantes útiles
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout'
  },
  COMPANIES: '/companies',
  SCANS: '/scans',
  FINDINGS: '/findings',
  TASKS: '/tasks',
  SUBSCRIPTIONS: '/subscriptions'
} as const;

export const SCAN_INTERVALS = {
  DAILY: 24 * 60 * 60 * 1000,
  WEEKLY: 7 * 24 * 60 * 60 * 1000,
  MONTHLY: 30 * 24 * 60 * 60 * 1000
} as const;
