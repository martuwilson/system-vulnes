import * as net from 'net';
import { PortScanResult } from '../types/scan-results';
import { i18n } from '../i18n';

export class PortScannerService {
  // Puertos comunes a escanear según el MVP
  private readonly COMMON_PORTS = [
    { port: 21, service: 'FTP', risk: 'HIGH' },
    { port: 22, service: 'SSH', risk: 'MEDIUM' },
    { port: 23, service: 'Telnet', risk: 'HIGH' },
    { port: 25, service: 'SMTP', risk: 'MEDIUM' },
    { port: 53, service: 'DNS', risk: 'LOW' },
    { port: 80, service: 'HTTP', risk: 'LOW' },
    { port: 110, service: 'POP3', risk: 'MEDIUM' },
    { port: 143, service: 'IMAP', risk: 'MEDIUM' },
    { port: 443, service: 'HTTPS', risk: 'LOW' },
    { port: 587, service: 'SMTP (Submission)', risk: 'LOW' },
    { port: 993, service: 'IMAPS', risk: 'LOW' },
    { port: 995, service: 'POP3S', risk: 'LOW' },
    { port: 3306, service: 'MySQL', risk: 'HIGH' },
    { port: 3389, service: 'RDP', risk: 'HIGH' },
    { port: 5432, service: 'PostgreSQL', risk: 'HIGH' },
    { port: 5984, service: 'CouchDB', risk: 'HIGH' },
    { port: 6379, service: 'Redis', risk: 'HIGH' },
    { port: 8080, service: 'HTTP Alternative', risk: 'MEDIUM' },
    { port: 8443, service: 'HTTPS Alternative', risk: 'MEDIUM' },
    { port: 27017, service: 'MongoDB', risk: 'HIGH' }
  ];

  /**
   * Escanea un puerto específico de un dominio
   */
  private async scanPort(domain: string, port: number, timeout: number = 3000): Promise<'open' | 'closed' | 'filtered'> {
    return new Promise((resolve) => {
      const socket = new net.Socket();
      
      socket.setTimeout(timeout);
      
      socket.on('connect', () => {
        socket.destroy();
        resolve('open');
      });
      
      socket.on('timeout', () => {
        socket.destroy();
        resolve('filtered');
      });
      
      socket.on('error', (error: any) => {
        socket.destroy();
        if (error.code === 'ECONNREFUSED') {
          resolve('closed');
        } else {
          resolve('filtered');
        }
      });
      
      socket.connect(port, domain);
    });
  }

  /**
   * Escanea múltiples puertos en paralelo con límite de concurrencia
   */
  private async scanPortsBatch(domain: string, ports: number[], batchSize: number = 10): Promise<{ port: number; status: 'open' | 'closed' | 'filtered' }[]> {
    const results: { port: number; status: 'open' | 'closed' | 'filtered' }[] = [];
    
    for (let i = 0; i < ports.length; i += batchSize) {
      const batch = ports.slice(i, i + batchSize);
      const batchPromises = batch.map(async (port) => {
        const status = await this.scanPort(domain, port);
        return { port, status };
      });
      
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
      
      // Pequeña pausa entre batches para no sobrecargar el target
      if (i + batchSize < ports.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    return results;
  }

  /**
   * Ejecuta el escaneo completo de puertos para un dominio
   */
  async scanCommonPorts(domain: string): Promise<PortScanResult> {
    const messages = i18n.getMessages();
    console.log(`🔍 ${messages.portScanner?.starting || 'Starting port scan for:'} ${domain}`);
    
    const portsToScan = this.COMMON_PORTS.map(p => p.port);
    const scanResults = await this.scanPortsBatch(domain, portsToScan);
    
    const openPorts: number[] = [];
    const closedPorts: number[] = [];
    const commonPorts: { port: number; service: string; status: 'open' | 'closed' | 'filtered' }[] = [];
    
    scanResults.forEach(result => {
      const portInfo = this.COMMON_PORTS.find(p => p.port === result.port);
      
      if (result.status === 'open') {
        openPorts.push(result.port);
      } else {
        closedPorts.push(result.port);
      }
      
      commonPorts.push({
        port: result.port,
        service: portInfo?.service || 'Unknown',
        status: result.status
      });
    });
    
    return {
      domain,
      openPorts,
      closedPorts,
      commonPorts
    };
  }

  /**
   * Analiza los riesgos de seguridad de los puertos abiertos
   */
  analyzePortRisks(scanResult: PortScanResult): {
    criticalRisks: { port: number; service: string; reason: string }[];
    warnings: { port: number; service: string; reason: string }[];
    info: { port: number; service: string; reason: string }[];
  } {
    const criticalRisks: { port: number; service: string; reason: string }[] = [];
    const warnings: { port: number; service: string; reason: string }[] = [];
    const info: { port: number; service: string; reason: string }[] = [];
    
    scanResult.openPorts.forEach(port => {
      const portInfo = this.COMMON_PORTS.find(p => p.port === port);
      if (!portInfo) return;
      
      const riskInfo = {
        port,
        service: portInfo.service,
        reason: this.getRiskReason(port, portInfo.service)
      };
      
      switch (portInfo.risk) {
        case 'HIGH':
          criticalRisks.push(riskInfo);
          break;
        case 'MEDIUM':
          warnings.push(riskInfo);
          break;
        case 'LOW':
          info.push(riskInfo);
          break;
      }
    });
    
    return { criticalRisks, warnings, info };
  }

  /**
   * Obtiene la razón del riesgo para un puerto específico
   */
  private getRiskReason(port: number, service: string): string {
    const riskReasons: { [key: number]: string } = {
      21: 'FTP service exposed - data transmitted in plain text',
      22: 'SSH service exposed - potential brute force target',
      23: 'Telnet service exposed - unencrypted remote access',
      25: 'SMTP service exposed - potential email relay abuse',
      110: 'POP3 service exposed - unencrypted email access',
      143: 'IMAP service exposed - unencrypted email access',
      3306: 'MySQL database exposed - critical data access risk',
      3389: 'RDP service exposed - common attack target',
      5432: 'PostgreSQL database exposed - critical data access risk',
      5984: 'CouchDB exposed - potential data exposure',
      6379: 'Redis exposed - potential data exposure and cache poisoning',
      8080: 'Alternative HTTP port exposed - potential backdoor',
      8443: 'Alternative HTTPS port exposed - verify legitimacy',
      27017: 'MongoDB exposed - critical NoSQL database access risk'
    };
    
    return riskReasons[port] || `${service} service exposed - review necessity`;
  }

  /**
   * Escaneo rápido de puertos críticos únicamente
   */
  async quickScan(domain: string): Promise<{ criticalPortsOpen: number[]; totalScanned: number }> {
    const criticalPorts = this.COMMON_PORTS
      .filter(p => p.risk === 'HIGH')
      .map(p => p.port);
    
    const results = await this.scanPortsBatch(domain, criticalPorts, 5);
    const openCriticalPorts = results
      .filter(r => r.status === 'open')
      .map(r => r.port);
    
    return {
      criticalPortsOpen: openCriticalPorts,
      totalScanned: criticalPorts.length
    };
  }
}
