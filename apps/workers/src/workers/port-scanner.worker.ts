import { PortScannerService } from '../services/port-scanner.service';
import { ScanResult, PortScanResult } from '../types/scan-results';
import { i18n } from '../i18n';

export class PortScannerWorker {
  private portScannerService: PortScannerService;

  constructor() {
    this.portScannerService = new PortScannerService();
  }

  /**
   * Ejecuta el escaneo completo de puertos para un dominio
   */
  async scanPorts(domain: string): Promise<{
    result: PortScanResult;
    findings: ScanResult[];
    score: number;
  }> {
    const messages = i18n.getMessages();
    console.log(`🔍 ${messages.portScanner?.starting || 'Starting port scan for:'} ${domain}`);
    
    const result = await this.portScannerService.scanCommonPorts(domain);
    const riskAnalysis = this.portScannerService.analyzePortRisks(result);
    const findings = this.generateFindings(result, riskAnalysis);
    const score = this.calculatePortScore(result, riskAnalysis);

    console.log(`✅ ${messages.portScanner?.completed || 'Port scan completed for'} ${domain}. Score: ${score}/100`);
    
    return {
      result,
      findings,
      score
    };
  }

  /**
   * Genera findings basados en los resultados del escaneo de puertos
   */
  private generateFindings(
    result: PortScanResult,
    riskAnalysis: {
      criticalRisks: { port: number; service: string; reason: string }[];
      warnings: { port: number; service: string; reason: string }[];
      info: { port: number; service: string; reason: string }[];
    }
  ): ScanResult[] {
    const findings: ScanResult[] = [];
    const messages = i18n.getMessages();

    // Critical Risk Ports (HIGH severity)
    riskAnalysis.criticalRisks.forEach(risk => {
      findings.push({
        category: 'NETWORK_SECURITY',
        severity: 'CRITICAL',
        title: messages.portScanner?.criticalPort?.title || `Critical Service Exposed: ${risk.service}`,
        description: messages.portScanner?.criticalPort?.description?.(risk.port, risk.service, risk.reason) || 
                    `Port ${risk.port} (${risk.service}) is open and accessible from the internet. ${risk.reason}`,
        recommendation: messages.portScanner?.criticalPort?.recommendation || 
                       'Immediately close this port or restrict access using firewall rules. Only allow access from trusted IP addresses.',
        score: 0
      });
    });

    // Warning Ports (MEDIUM severity)
    riskAnalysis.warnings.forEach(warning => {
      findings.push({
        category: 'NETWORK_SECURITY',
        severity: 'MEDIUM',
        title: messages.portScanner?.warningPort?.title || `Service Exposed: ${warning.service}`,
        description: messages.portScanner?.warningPort?.description?.(warning.port, warning.service, warning.reason) || 
                    `Port ${warning.port} (${warning.service}) is open. ${warning.reason}`,
        recommendation: messages.portScanner?.warningPort?.recommendation || 
                       'Review if this service needs to be publicly accessible. Consider restricting access or using VPN.',
        score: 60
      });
    });

    // General findings based on open port count
    if (result.openPorts.length === 0) {
      findings.push({
        category: 'NETWORK_SECURITY',
        severity: 'LOW',
        title: messages.portScanner?.noPorts?.title || 'No Common Ports Open',
        description: messages.portScanner?.noPorts?.description || 'No common ports are open to the internet, which is good for security.',
        recommendation: messages.portScanner?.noPorts?.recommendation || 'Continue monitoring and ensure only necessary services are exposed.',
        score: 100
      });
    } else if (result.openPorts.length > 5) {
      findings.push({
        category: 'NETWORK_SECURITY',
        severity: 'MEDIUM',
        title: messages.portScanner?.manyPorts?.title || 'Multiple Ports Open',
        description: messages.portScanner?.manyPorts?.description?.(result.openPorts.length) || 
                    `${result.openPorts.length} ports are open to the internet. This increases the attack surface.`,
        recommendation: messages.portScanner?.manyPorts?.recommendation || 
                       'Review all open ports and close any that are not essential for business operations.',
        score: 40
      });
    }

    // Specific high-risk port warnings
    if (result.openPorts.includes(22)) {
      findings.push({
        category: 'NETWORK_SECURITY',
        severity: 'MEDIUM',
        title: messages.portScanner?.sshExposed?.title || 'SSH Service Exposed',
        description: messages.portScanner?.sshExposed?.description || 
                    'SSH (port 22) is accessible from the internet, making it a target for brute force attacks.',
        recommendation: messages.portScanner?.sshExposed?.recommendation || 
                       'Consider changing SSH to a non-standard port, using key-based authentication, or restricting access by IP.',
        score: 70
      });
    }

    if (result.openPorts.includes(3389)) {
      findings.push({
        category: 'NETWORK_SECURITY',
        severity: 'HIGH',
        title: messages.portScanner?.rdpExposed?.title || 'RDP Service Exposed',
        description: messages.portScanner?.rdpExposed?.description || 
                    'Remote Desktop Protocol (port 3389) is exposed to the internet, which is extremely dangerous.',
        recommendation: messages.portScanner?.rdpExposed?.recommendation || 
                       'Immediately restrict RDP access to specific IP addresses or use VPN. Consider disabling RDP if not needed.',
        score: 20
      });
    }

    return findings;
  }

  /**
   * Calcula un score de 0-100 basado en los puertos abiertos y riesgos
   */
  private calculatePortScore(
    result: PortScanResult,
    riskAnalysis: {
      criticalRisks: { port: number; service: string; reason: string }[];
      warnings: { port: number; service: string; reason: string }[];
      info: { port: number; service: string; reason: string }[];
    }
  ): number {
    let score = 100;

    // Penalización por puertos críticos abiertos
    score -= riskAnalysis.criticalRisks.length * 40; // -40 puntos por cada puerto crítico

    // Penalización por puertos de advertencia
    score -= riskAnalysis.warnings.length * 15; // -15 puntos por cada puerto de advertencia

    // Penalización por muchos puertos abiertos
    if (result.openPorts.length > 10) {
      score -= 25; // Penalización adicional por superficie de ataque grande
    } else if (result.openPorts.length > 5) {
      score -= 10; // Penalización menor por superficie de ataque moderada
    }

    // Bonus por no tener puertos críticos abiertos
    if (riskAnalysis.criticalRisks.length === 0 && result.openPorts.length <= 3) {
      score += 5; // Pequeño bonus por buena configuración
    }

    return Math.max(0, Math.min(100, score)); // Asegurar que esté entre 0-100
  }

  /**
   * Escaneo rápido solo de puertos críticos (para uso en monitoreo)
   */
  async quickPortScan(domain: string): Promise<{
    criticalPortsFound: number;
    score: number;
    urgent: boolean;
  }> {
    const quickResult = await this.portScannerService.quickScan(domain);
    
    return {
      criticalPortsFound: quickResult.criticalPortsOpen.length,
      score: quickResult.criticalPortsOpen.length === 0 ? 100 : Math.max(0, 100 - (quickResult.criticalPortsOpen.length * 50)),
      urgent: quickResult.criticalPortsOpen.length > 0
    };
  }
}
