import { Injectable, Logger } from '@nestjs/common';
import { FindingCategory, Severity, FindingStatus } from '@prisma/client';
import * as net from 'net';
import { ScanFinding } from './email-security.scanner';

@Injectable()
export class PortScanner {
  private readonly logger = new Logger(PortScanner.name);

  // Puertos comunes que generalmente deberían estar protegidos
  private readonly COMMON_PORTS = [
    { port: 21, service: 'FTP', risk: 'HIGH' },
    { port: 22, service: 'SSH', risk: 'MEDIUM' },
    { port: 23, service: 'Telnet', risk: 'CRITICAL' },
    { port: 25, service: 'SMTP', risk: 'MEDIUM' },
    { port: 53, service: 'DNS', risk: 'LOW' },
    { port: 80, service: 'HTTP', risk: 'LOW' },
    { port: 110, service: 'POP3', risk: 'MEDIUM' },
    { port: 143, service: 'IMAP', risk: 'MEDIUM' },
    { port: 443, service: 'HTTPS', risk: 'LOW' },
    { port: 993, service: 'IMAPS', risk: 'LOW' },
    { port: 995, service: 'POP3S', risk: 'LOW' },
    { port: 1433, service: 'SQL Server', risk: 'HIGH' },
    { port: 3306, service: 'MySQL', risk: 'HIGH' },
    { port: 3389, service: 'RDP', risk: 'HIGH' },
    { port: 5432, service: 'PostgreSQL', risk: 'HIGH' },
    { port: 5984, service: 'CouchDB', risk: 'HIGH' },
    { port: 6379, service: 'Redis', risk: 'HIGH' },
    { port: 8080, service: 'HTTP Alt', risk: 'MEDIUM' },
    { port: 8443, service: 'HTTPS Alt', risk: 'MEDIUM' },
    { port: 27017, service: 'MongoDB', risk: 'HIGH' },
  ];

  async scan(domain: string): Promise<ScanFinding[]> {
    const findings: ScanFinding[] = [];
    
    this.logger.log(`Starting port scan for domain: ${domain}`);

    try {
      // Resolver domain a IP
      const ipAddress = await this.resolveDomainToIP(domain);
      if (!ipAddress) {
        return [{
          category: FindingCategory.NETWORK_SECURITY,
          severity: Severity.MEDIUM,
          title: 'Domain Resolution Failed',
          description: `Unable to resolve domain ${domain} to an IP address for port scanning.`,
          recommendation: 'Verify that the domain has proper DNS configuration.',
          status: FindingStatus.OPEN
        }];
      }

      this.logger.debug(`Resolved ${domain} to ${ipAddress}`);

      // Escanear puertos comunes
      const openPorts = await this.scanCommonPorts(ipAddress);
      
      // Analizar puertos abiertos y generar findings
      for (const openPort of openPorts) {
        const portInfo = this.COMMON_PORTS.find(p => p.port === openPort);
        
        if (portInfo) {
          const severity = this.getRiskSeverity(portInfo.risk);
          const finding = this.createPortFinding(domain, openPort, portInfo, severity);
          findings.push(finding);
        } else {
          // Puerto desconocido abierto
          findings.push({
            category: FindingCategory.NETWORK_SECURITY,
            severity: Severity.MEDIUM,
            title: `Unknown Service on Port ${openPort}`,
            description: `Port ${openPort} is open on ${domain} but the service is not identified.`,
            recommendation: `Investigate what service is running on port ${openPort}. Close the port if the service is not needed.`,
            status: FindingStatus.OPEN
          });
        }
      }

      // Si no hay puertos abiertos peligrosos, es bueno
      if (findings.length === 0) {
        this.logger.debug(`No concerning open ports found for ${domain}`);
      }

      // Verificar puertos web específicamente
      const webPortFindings = await this.checkWebPortsSpecifically(domain);
      findings.push(...webPortFindings);

      this.logger.log(`Port scan completed for ${domain}: ${findings.length} findings`);
      return findings;

    } catch (error) {
      this.logger.error(`Port scan failed for ${domain}:`, error);
      
      return [{
        category: FindingCategory.NETWORK_SECURITY,
        severity: Severity.MEDIUM,
        title: 'Port Scan Failed',
        description: `Unable to complete port scan for ${domain}: ${error.message}`,
        recommendation: 'Verify that the domain is accessible and properly configured.',
        status: FindingStatus.OPEN
      }];
    }
  }

  /**
   * Resolver domain a IP address
   */
  private async resolveDomainToIP(domain: string): Promise<string | null> {
    return new Promise((resolve) => {
      const dns = require('dns');
      dns.lookup(domain, (err: any, address: string) => {
        if (err) {
          this.logger.debug(`DNS lookup failed for ${domain}: ${err.message}`);
          resolve(null);
        } else {
          resolve(address);
        }
      });
    });
  }

  /**
   * Escanear puertos comunes
   */
  private async scanCommonPorts(ipAddress: string): Promise<number[]> {
    const openPorts: number[] = [];
    const scanPromises: Promise<void>[] = [];

    for (const portInfo of this.COMMON_PORTS) {
      const promise = this.checkPort(ipAddress, portInfo.port)
        .then(isOpen => {
          if (isOpen) {
            openPorts.push(portInfo.port);
            this.logger.debug(`Port ${portInfo.port} (${portInfo.service}) is open on ${ipAddress}`);
          }
        })
        .catch(error => {
          this.logger.debug(`Error checking port ${portInfo.port}: ${error.message}`);
        });
      
      scanPromises.push(promise);
    }

    // Esperar a que terminen todos los escaneos de puertos
    await Promise.all(scanPromises);
    
    return openPorts.sort((a, b) => a - b);
  }

  /**
   * Verificar si un puerto específico está abierto
   */
  private async checkPort(host: string, port: number): Promise<boolean> {
    return new Promise((resolve) => {
      const socket = new net.Socket();
      const timeout = 3000; // 3 segundos timeout

      const onError = () => {
        socket.destroy();
        resolve(false);
      };

      socket.setTimeout(timeout);
      socket.on('timeout', onError);
      socket.on('error', onError);

      socket.connect(port, host, () => {
        socket.destroy();
        resolve(true);
      });
    });
  }

  /**
   * Convertir nivel de riesgo a severidad
   */
  private getRiskSeverity(risk: string): Severity {
    switch (risk) {
      case 'CRITICAL':
        return Severity.CRITICAL;
      case 'HIGH':
        return Severity.HIGH;
      case 'MEDIUM':
        return Severity.MEDIUM;
      case 'LOW':
        return Severity.LOW;
      default:
        return Severity.MEDIUM;
    }
  }

  /**
   * Crear finding para puerto abierto
   */
  private createPortFinding(domain: string, port: number, portInfo: any, severity: Severity): ScanFinding {
    const descriptions: { [key: string]: string } = {
      'FTP': 'FTP service is running which transmits credentials in plain text.',
      'SSH': 'SSH service is exposed to the internet. Ensure strong authentication is configured.',
      'Telnet': 'Telnet service is running which transmits all data including passwords in plain text.',
      'SMTP': 'SMTP service is exposed. Ensure proper authentication and encryption are configured.',
      'POP3': 'POP3 service is exposed. Consider using encrypted POP3S instead.',
      'IMAP': 'IMAP service is exposed. Consider using encrypted IMAPS instead.',
      'SQL Server': 'SQL Server database is directly exposed to the internet.',
      'MySQL': 'MySQL database is directly exposed to the internet.',
      'RDP': 'Remote Desktop Protocol is exposed which is commonly targeted by attackers.',
      'PostgreSQL': 'PostgreSQL database is directly exposed to the internet.',
      'CouchDB': 'CouchDB database is exposed and may be misconfigured.',
      'Redis': 'Redis service is exposed and likely misconfigured without authentication.',
      'MongoDB': 'MongoDB database is directly exposed to the internet.',
      'HTTP Alt': 'Alternative HTTP service is running on a non-standard port.',
      'HTTPS Alt': 'Alternative HTTPS service is running on a non-standard port.',
    };

    const recommendations: { [key: string]: string } = {
      'FTP': 'Disable FTP service and use SFTP or FTPS instead. If FTP is required, restrict access by IP address.',
      'SSH': 'Restrict SSH access by IP address, use key-based authentication, and disable root login.',
      'Telnet': 'Immediately disable Telnet service and use SSH instead.',
      'SMTP': 'Restrict SMTP access, enable authentication, and use encrypted connections (STARTTLS).',
      'POP3': 'Switch to POP3S (port 995) or disable POP3 if not needed.',
      'IMAP': 'Switch to IMAPS (port 993) or disable IMAP if not needed.',
      'SQL Server': 'Restrict database access to specific IP addresses and use VPN for remote access.',
      'MySQL': 'Restrict database access to specific IP addresses and use VPN for remote access.',
      'RDP': 'Restrict RDP access by IP address, use Network Level Authentication, and consider VPN access.',
      'PostgreSQL': 'Restrict database access to specific IP addresses and use VPN for remote access.',
      'CouchDB': 'Secure CouchDB installation, enable authentication, and restrict access.',
      'Redis': 'Configure Redis authentication, bind to localhost only, and use firewall rules.',
      'MongoDB': 'Enable MongoDB authentication, restrict access by IP, and use encrypted connections.',
      'HTTP Alt': 'Verify if this service is necessary and properly secured.',
      'HTTPS Alt': 'Verify if this service is necessary and properly secured.',
    };

    return {
      category: FindingCategory.NETWORK_SECURITY,
      severity: severity,
      title: `${portInfo.service} Service Exposed (Port ${port})`,
      description: `${descriptions[portInfo.service] || `${portInfo.service} service is running on port ${port}.`}`,
      recommendation: recommendations[portInfo.service] || `Review if ${portInfo.service} service on port ${port} is necessary and properly secured.`,
      status: FindingStatus.OPEN
    };
  }

  /**
   * Verificaciones específicas para puertos web
   */
  private async checkWebPortsSpecifically(domain: string): Promise<ScanFinding[]> {
    const findings: ScanFinding[] = [];

    try {
      // Verificar si HTTP está disponible pero HTTPS no
      const httpOpen = await this.checkPort(domain, 80);
      const httpsOpen = await this.checkPort(domain, 443);

      if (httpOpen && !httpsOpen) {
        findings.push({
          category: FindingCategory.WEB_SECURITY,
          severity: Severity.MEDIUM,
          title: 'HTTPS Not Available',
          description: `Domain ${domain} serves content over HTTP (port 80) but HTTPS (port 443) is not available.`,
          recommendation: 'Enable HTTPS by installing an SSL certificate and redirecting HTTP traffic to HTTPS.',
          status: FindingStatus.OPEN
        });
      }

      // Verificar puertos web no estándar
      const alternativeWebPorts = [8080, 8443, 8000, 8001, 8888];
      for (const port of alternativeWebPorts) {
        const isOpen = await this.checkPort(domain, port);
        if (isOpen) {
          findings.push({
            category: FindingCategory.WEB_SECURITY,
            severity: Severity.LOW,
            title: `Web Service on Non-Standard Port ${port}`,
            description: `Web service detected on non-standard port ${port}. This might be intentional but could indicate a development or admin interface.`,
            recommendation: `Verify that the service on port ${port} is intended for public access and properly secured.`,
            status: FindingStatus.OPEN
          });
        }
      }

    } catch (error) {
      this.logger.debug(`Web port check failed: ${error.message}`);
    }

    return findings;
  }
}
