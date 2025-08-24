# Explicación detallada: SSL Certificate Worker

Este documento explica el funcionamiento y propósito del SSL Certificate Worker dentro del sistema de seguridad para PYMEs.

## ¿Qué es el SSL Certificate Worker?

El SSL Certificate Worker es un sistema completo que automatiza el análisis de seguridad SSL/TLS de un dominio. Evalúa la validez, configuración y estado de los certificados SSL, así como la implementación de HTTPS en el sitio web.

## Componentes principales

### 1. SSLService (`ssl.service.ts`)

#### `checkSSLCertificate(domain, port = 443)`
- **Propósito:** Verifica el certificado SSL de un dominio.
- **Qué hace:**
  - Se conecta al puerto 443 (HTTPS) del dominio.
  - Obtiene el certificado y analiza su validez.
  - Verifica si está expirado o expira pronto (< 30 días).
  - Detecta cifrados débiles (RC4, DES) y protocolos obsoletos (TLS 1.0, SSL).
  - Valida que el certificado coincida con el dominio.
  - Identifica la autoridad certificadora (issuer).

#### `checkHTTPSRedirect(domain)`
- **Propósito:** Verifica si el sitio redirige HTTP a HTTPS.
- **Qué hace:**
  - Se conecta al puerto 80 (HTTP) del dominio.
  - Envía una petición HTTP y analiza la respuesta.
  - Detecta redirecciones 301/302 a HTTPS.
  - Identifica sitios que sirven contenido HTTP sin redirigir.

#### `checkSSLSecurity(domain)`
- **Propósito:** Ejecuta ambas verificaciones en paralelo.
- **Qué hace:**
  - Combina resultados de certificado SSL y redirección HTTP.
  - Devuelve un objeto completo con todos los hallazgos.

### 2. SSLCertificateWorker (`ssl-certificate.worker.ts`)

#### `scanSSLSecurity(domain)`
- **Propósito:** Orquesta el escaneo completo de SSL.
- **Qué hace:**
  - Ejecuta el SSLService.
  - Genera findings con severidad y recomendaciones.
  - Calcula un score de 0-100 basado en los problemas encontrados.

#### `generateFindings(result)`
- **Propósito:** Convierte resultados técnicos en findings accionables.
- **Qué hace:**
  - **Certificado expirado:** CRITICAL (0 puntos) - Renovación inmediata.
  - **Expira en 7 días:** HIGH (20 puntos) - Renovación urgente.
  - **Expira en 30 días:** MEDIUM (70 puntos) - Planificar renovación.
  - **Dominio no coincide:** HIGH (10 puntos) - Certificado incorrecto.
  - **Cifrado débil:** HIGH (30 puntos) - Actualizar configuración.
  - **Sin redirección HTTPS:** MEDIUM/HIGH - Configurar redirección.

#### `calculateSSLScore(result)`
- **Propósito:** Calcula un score numérico de la seguridad SSL.
- **Scoring:**
  - Certificado expirado: -60 puntos
  - Expira en 7 días: -30 puntos
  - Expira en 30 días: -10 puntos
  - Dominio no coincide: -40 puntos
  - Cifrado débil: -25 puntos
  - Sin redirección HTTPS: -15 a -25 puntos

## Integración con i18n

El worker soporta mensajes en **español** e **inglés**:
- Títulos de findings traducidos
- Descripciones contextuales en ambos idiomas
- Recomendaciones específicas por idioma
- Logging multiidioma

## Ejemplos de uso

### Certificado válido (Score: 100/100)
```
- Certificado válido: ✅
- Redirección HTTPS: ✅
- Vence: 2/5/2026 (166 días)
- Emisor: Sectigo ECC Domain Validation Secure Server CA
```

### Certificado con problemas (Score: 20/100)
```
HALLAZGOS DE SEGURIDAD:
1. Certificado SSL Expirado (CRITICAL)
   El certificado SSL para este dominio ha vencido.
   💡 Renueva tu certificado SSL inmediatamente.
```

## ¿Para qué sirve?

- **Prevención de downtime:** Alerta sobre certificados que expiran.
- **Seguridad de usuarios:** Detecta configuraciones SSL inseguras.
- **Compliance:** Verifica que el sitio implemente HTTPS correctamente.
- **Monitoreo automatizado:** Evalúa la salud SSL sin intervención manual.

## Resumen

El SSL Certificate Worker automatiza la evaluación completa de la seguridad SSL/TLS de cualquier dominio, detectando problemas críticos como certificados expirados, configuraciones débiles y falta de redirección HTTPS. Es esencial para mantener la confianza de los usuarios y prevenir interrupciones del servicio.
