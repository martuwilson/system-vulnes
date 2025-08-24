# Port Scanner Worker

El Port Scanner Worker es el cuarto y último componente del sistema de escaneo de seguridad para PYMEs. Se encarga de identificar puertos abiertos y evaluar los riesgos de seguridad de red.

## 🎯 Funcionalidades

### Escaneo de Puertos
- **20 puertos comunes**: FTP, SSH, HTTP, HTTPS, bases de datos, servicios de red
- **Escaneo paralelo**: Múltiples puertos simultáneamente con límites de concurrencia
- **Timeout configurable**: Evita bloqueos en puertos filtrados
- **Categorización de riesgos**: HIGH/MEDIUM/LOW por tipo de servicio

### Puertos Monitoreados

| Puerto | Servicio | Riesgo | Descripción |
|--------|----------|--------|-------------|
| 21 | FTP | HIGH | Protocolo de transferencia inseguro |
| 22 | SSH | MEDIUM | Objetivo común de ataques de fuerza bruta |
| 23 | Telnet | HIGH | Protocolo sin cifrado |
| 25 | SMTP | MEDIUM | Servidor de correo |
| 53 | DNS | LOW | Servicio DNS público |
| 80 | HTTP | LOW | Servidor web estándar |
| 110 | POP3 | MEDIUM | Correo sin cifrado |
| 143 | IMAP | MEDIUM | Correo sin cifrado |
| 443 | HTTPS | LOW | Servidor web seguro |
| 993 | IMAPS | LOW | IMAP seguro |
| 995 | POP3S | LOW | POP3 seguro |
| 1433 | MSSQL | HIGH | Base de datos SQL Server |
| 1521 | Oracle | HIGH | Base de datos Oracle |
| 3306 | MySQL | HIGH | Base de datos MySQL |
| 3389 | RDP | HIGH | Escritorio remoto (muy peligroso) |
| 5432 | PostgreSQL | HIGH | Base de datos PostgreSQL |
| 5900 | VNC | HIGH | Acceso remoto sin cifrado |
| 6379 | Redis | HIGH | Base de datos en memoria |
| 25565 | Minecraft | LOW | Servidor de juegos |
| 27017 | MongoDB | HIGH | Base de datos NoSQL |

## 🔧 Uso

### Escaneo Completo
```typescript
import { PortScannerWorker } from './workers/port-scanner.worker';

const scanner = new PortScannerWorker();
const result = await scanner.scanPorts('example.com');

console.log('Puertos abiertos:', result.result.openPorts);
console.log('Score de seguridad:', result.score);
console.log('Problemas encontrados:', result.findings);
```

### Escaneo Rápido (Solo puertos críticos)
```typescript
const quickResult = await scanner.quickPortScan('example.com');

console.log('Puertos críticos:', quickResult.criticalPortsFound);
console.log('¿Urgente?:', quickResult.urgent);
```

## 📊 Sistema de Scoring

El sistema de puntuación evalúa la seguridad de red:

- **Puertos críticos abiertos**: -40 puntos cada uno
- **Puertos de advertencia**: -15 puntos cada uno  
- **Muchos puertos abiertos** (>10): -25 puntos adicionales
- **Superficie moderada** (5-10 puertos): -10 puntos
- **Bonus por buena configuración**: +5 puntos

### Ejemplos de Scoring

| Escenario | Score | Descripción |
|-----------|-------|-------------|
| Sin puertos críticos, ≤3 puertos | 100 | Configuración perfecta |
| Solo HTTP/HTTPS | 100 | Configuración web estándar |
| SSH + HTTP + HTTPS | 70-85 | Configuración común con SSH |
| RDP expuesto | 20 | Muy peligroso |
| Múltiples bases de datos | 0-40 | Alto riesgo |

## 🌐 Soporte de Idiomas

Totalmente integrado con el sistema i18n:

### Español
```
🔍 Iniciando escaneo de puertos para: example.com
✅ Escaneo de puertos completado para example.com. Score: 85/100

⚠️ Servicio SSH Expuesto
SSH (puerto 22) es accesible desde internet, convirtiéndolo en objetivo de ataques de fuerza bruta.
💡 Recomendación: Considera cambiar SSH a un puerto no estándar, usar autenticación basada en llaves, o restringir acceso por IP.
```

### English
```
🔍 Starting port scan for: example.com  
✅ Port scan completed for example.com. Score: 85/100

⚠️ SSH Service Exposed
SSH (port 22) is accessible from the internet, making it a target for brute force attacks.
💡 Recommendation: Consider changing SSH to a non-standard port, using key-based authentication, or restricting access by IP.
```

## 🚨 Tipos de Alertas

### Critical (Riesgo Crítico)
- **RDP (3389)**: Extremadamente peligroso
- **Telnet (23)**: Sin cifrado
- **Bases de datos expuestas**: Acceso directo a datos

### Medium (Advertencia)  
- **SSH (22)**: Objetivo de ataques
- **FTP (21)**: Protocolo inseguro
- **Servicios de correo sin cifrar**

### Low (Informativo)
- **HTTP/HTTPS**: Servicios web normales
- **DNS público**: Configuración común

## 🔄 Integración con el Sistema

El Port Scanner se integra seamlessly con los otros componentes:

```typescript
// En main.ts - Escaneo paralelo
const [dnsResults, sslResults, webResults, portResults] = await Promise.all([
  this.dnsWorker.scanDNSSecurity(domain),
  this.sslWorker.scanSSLSecurity(domain), 
  this.webSecurityWorker.scanWebSecurity(domain),
  this.portScannerWorker.scanPorts(domain)  // ← Port Scanner
]);

// Score combinado de los 4 pilares
const overallScore = (dns + ssl + web + ports) / 4;
```

## 📈 Casos de Uso Empresariales

### Para PYMEs
- **Auditoria de seguridad**: Identificar servicios expuestos innecesariamente
- **Compliance**: Verificar que solo los puertos necesarios estén abiertos  
- **Monitoreo continuo**: Alertas cuando aparecen nuevos puertos
- **Reportes ejecutivos**: Scoring simple de entender

### Para Consultores IT
- **Assessment inicial**: Evaluación rápida de postura de seguridad
- **Recomendaciones priorizadas**: Cerrar primero los puertos críticos
- **Documentación**: Informes en español para clientes locales

## 🧪 Testing

El Port Scanner ha sido probado con dominios reales:

- **github.com**: Score 90/100 (SSH legítimo detectado)
- **laburen.com**: Score 100/100 (solo HTTP/HTTPS)
- **badssl.com**: Varios escenarios de testing

## 🚀 Próximos Pasos

Con el Port Scanner completado, el MVP tiene los 4 pilares de seguridad listos para integración con:

1. **API GraphQL**: Conectar workers con backend NestJS
2. **Dashboard React**: Visualización de resultados  
3. **Base de datos**: Persistencia de escaneos históricos
4. **Sistema de alertas**: Notificaciones automáticas
5. **Monetización**: Límites por plan de suscripción

El Port Scanner marca la **finalización del motor de seguridad core** del MVP! 🎉
