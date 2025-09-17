import { Injectable, Logger } from '@nestjs/common';

export interface LogContext {
  userId?: string;
  companyId?: string;
  scanId?: string;
  domain?: string;
  action: string;
  timestamp?: Date;
}

@Injectable()
export class SecurityLogger {
  private readonly logger = new Logger('SecuritySystem');

  logScanStart(context: LogContext) {
    this.logger.log(
      `Scan started for domain: ${context.domain}`,
      {
        ...context,
        level: 'info',
        timestamp: new Date().toISOString(),
      }
    );
  }

  logScanComplete(context: LogContext & { 
    healthScore: number; 
    findingsCount: number; 
    duration: number;
  }) {
    this.logger.log(
      `Scan completed for domain: ${context.domain} - Score: ${context.healthScore}% - Findings: ${context.findingsCount} - Duration: ${context.duration}ms`,
      context
    );
  }

  logScanError(context: LogContext, error: Error) {
    this.logger.error(
      `Scan failed for domain: ${context.domain} - Error: ${error.message}`,
      {
        ...context,
        error: error.stack,
        timestamp: new Date().toISOString(),
      }
    );
  }

  logUserAction(context: LogContext) {
    this.logger.log(
      `User action: ${context.action}`,
      context
    );
  }
}
