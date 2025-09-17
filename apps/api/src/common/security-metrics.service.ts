import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

export interface SecurityMetric {
  name: string;
  value: number;
  tags: Record<string, string>;
  timestamp: Date;
}

@Injectable()
export class SecurityMetricsService {
  constructor(private eventEmitter: EventEmitter2) {}

  // Métricas de escaneo
  recordScanStarted(domain: string, companyId: string) {
    this.emit('scan.started', {
      name: 'security_scan_started',
      value: 1,
      tags: { domain, companyId },
      timestamp: new Date(),
    });
  }

  recordScanCompleted(domain: string, companyId: string, duration: number, healthScore: number) {
    this.emit('scan.completed', {
      name: 'security_scan_completed',
      value: 1,
      tags: { domain, companyId },
      timestamp: new Date(),
    });

    this.emit('scan.duration', {
      name: 'security_scan_duration_ms',
      value: duration,
      tags: { domain, companyId },
      timestamp: new Date(),
    });

    this.emit('scan.health_score', {
      name: 'security_health_score',
      value: healthScore,
      tags: { domain, companyId },
      timestamp: new Date(),
    });
  }

  recordScanFailed(domain: string, companyId: string, errorType: string) {
    this.emit('scan.failed', {
      name: 'security_scan_failed',
      value: 1,
      tags: { domain, companyId, errorType },
      timestamp: new Date(),
    });
  }

  recordFindingCreated(category: string, severity: string, companyId: string) {
    this.emit('finding.created', {
      name: 'security_finding_created',
      value: 1,
      tags: { category, severity, companyId },
      timestamp: new Date(),
    });
  }

  recordUserAction(action: string, userId: string, companyId: string) {
    this.emit('user.action', {
      name: 'user_action',
      value: 1,
      tags: { action, userId, companyId },
      timestamp: new Date(),
    });
  }

  // Métricas de sistema
  recordApiRequest(endpoint: string, method: string, statusCode: number, duration: number) {
    this.emit('api.request', {
      name: 'api_request',
      value: 1,
      tags: { endpoint, method, status: statusCode.toString() },
      timestamp: new Date(),
    });

    this.emit('api.duration', {
      name: 'api_request_duration_ms',
      value: duration,
      tags: { endpoint, method },
      timestamp: new Date(),
    });
  }

  private emit(event: string, metric: SecurityMetric) {
    this.eventEmitter.emit(event, metric);
    
    // También enviar a servicio de métricas externo si está configurado
    if (process.env.METRICS_ENDPOINT) {
      this.sendToExternalMetrics(metric).catch(error => {
        console.error('Failed to send metric to external service:', error);
      });
    }
  }

  private async sendToExternalMetrics(metric: SecurityMetric) {
    // Implementar envío a Prometheus, DataDog, etc.
    // Por ahora solo log
    console.log(`METRIC: ${metric.name} = ${metric.value} [${JSON.stringify(metric.tags)}]`);
  }

  // Obtener resumen de métricas
  async getMetricsSummary(companyId: string, timeRange: { from: Date; to: Date }) {
    // En una implementación real, esto consultaría una base de datos de métricas
    return {
      totalScans: 0,
      successfulScans: 0,
      failedScans: 0,
      averageHealthScore: 0,
      averageScanDuration: 0,
      totalFindings: 0,
      findingsByCategory: {},
      findingsBySeverity: {},
    };
  }
}
