# Explicación detallada: DNSService

Este documento explica el funcionamiento y propósito del archivo `dns.service.ts` dentro del worker de seguridad para PYMEs.

## ¿Qué es DNSService?

`DNSService` es una clase TypeScript que automatiza el análisis de seguridad de los registros DNS de un dominio, enfocado en la protección del correo electrónico. Es el núcleo del worker de email security del MVP.

## Métodos principales

### 1. `checkSPF(domain: string)`
- **Propósito:** Verifica si el dominio tiene un registro SPF válido.
- **Qué hace:**
  - Busca el registro SPF en el DNS.
  - Verifica si existe y si está bien configurado (debe terminar en `~all` o `-all`).
  - Advierte si hay problemas como el uso de `+all` (que permite spoofing).
  - Devuelve: existencia, validez y lista de problemas detectados.

### 2. `checkDMARC(domain: string)`
- **Propósito:** Verifica la existencia y configuración del registro DMARC.
- **Qué hace:**
  - Busca el registro DMARC (`_dmarc.dominio`).
  - Extrae la política (`none`, `quarantine`, `reject`).
  - Advierte si la política es demasiado permisiva o si el registro no existe.
  - Devuelve: existencia, política, registro y lista de problemas detectados.

### 3. `checkDKIM(domain: string)`
- **Propósito:** Detecta si el dominio tiene DKIM configurado.
- **Qué hace:**
  - Busca registros DKIM usando selectores comunes (`default`, `google`, etc).
  - Si encuentra alguno, lo marca como configurado.
  - Si no, advierte que la autenticación de email puede ser débil.
  - Devuelve: si está configurado, selectores encontrados y lista de problemas.

### 4. `checkDNSSecurity(domain: string)`
- **Propósito:** Ejecuta los tres chequeos anteriores en paralelo.
- **Qué hace:**
  - Llama a `checkSPF`, `checkDMARC` y `checkDKIM` simultáneamente.
  - Devuelve un objeto con todos los resultados (SPF, DKIM, DMARC).

## ¿Para qué sirve?
- Permite escanear un dominio y saber si está protegido contra spoofing y phishing.
- Genera findings automáticos para el dashboard del MVP.
- Es el núcleo del worker de email security.

## Ejemplo de uso
```ts
const dnsService = new DNSService();
const result = await dnsService.checkDNSSecurity('midominio.com');
console.log(result);
```

## Resumen
`DNSService` automatiza el análisis de seguridad de correo electrónico de cualquier dominio, detectando configuraciones débiles o faltantes en SPF, DKIM y DMARC. Es esencial para mostrar riesgos reales y recomendaciones accionables en el dashboard de la app.
