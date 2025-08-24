import { Messages } from './types';

export const esMessages: Messages = {
  dns: {
    starting: '🔍 Iniciando escaneo de seguridad DNS para:',
    completed: '✅ Escaneo DNS completado para',
    spf: {
      missing: {
        title: 'Registro SPF Faltante',
        description: 'No se encontró registro SPF para este dominio. Esto permite que atacantes falsifiquen emails de tu dominio fácilmente.',
        recommendation: 'Crea un registro SPF en tu configuración DNS. Comienza con "v=spf1 include:_spf.google.com ~all" si usas Google Workspace.'
      },
      invalid: {
        title: 'Problema de Configuración SPF',
        description: 'El registro SPF tiene problemas de configuración que pueden afectar la seguridad del email.',
        recommendation: 'Revisa y actualiza tu registro SPF para seguir las mejores prácticas.'
      }
    },
    dmarc: {
      missing: {
        title: 'Registro DMARC Faltante',
        description: 'No se encontró registro DMARC. Tu dominio es vulnerable a ataques de spoofing y phishing por email.',
        recommendation: 'Implementa un registro DMARC comenzando con "v=DMARC1; p=quarantine; rua=mailto:dmarc@tudominio.com"'
      },
      permissive: {
        title: 'Política DMARC Muy Permisiva',
        description: 'La política DMARC está configurada en "none", lo que proporciona monitoreo pero no protección contra spoofing.',
        recommendation: 'Actualiza la política DMARC a "quarantine" o "reject" para mejor seguridad del email.'
      }
    },
    dkim: {
      missing: {
        title: 'DKIM No Configurado',
        description: 'No se encontraron registros DKIM con selectores comunes. La autenticación de email puede estar incompleta.',
        recommendation: 'Configura la firma DKIM con tu proveedor de email para mejorar la entregabilidad y seguridad del correo.'
      }
    }
  },
  
  ssl: {
    starting: '🔒 Iniciando escaneo de seguridad SSL para:',
    completed: '✅ Escaneo SSL completado para',
    expired: {
      title: 'Certificado SSL Vencido',
      description: 'El certificado SSL para este dominio ha vencido. Los usuarios verán advertencias de seguridad.',
      recommendation: 'Renueva tu certificado SSL inmediatamente a través de tu proveedor de hosting o autoridad certificadora.'
    },
    expiring: {
      title: 'Certificado SSL Venciendo Pronto',
      description: (days: number) => `El certificado SSL vence en ${days} días. Planifica la renovación para evitar interrupción del servicio.`,
      recommendation: 'Configura renovación automática del certificado o renuévalo manualmente antes del vencimiento.'
    },
    domainMismatch: {
      title: 'Discrepancia de Dominio en Certificado SSL',
      description: 'El certificado SSL no es válido para este nombre de dominio.',
      recommendation: 'Instala un certificado que coincida con tu nombre de dominio o usa un certificado wildcard.'
    },
    weakConfig: {
      title: 'Configuración SSL/TLS Débil',
      description: 'El servidor está usando protocolos SSL/TLS obsoletos o suites de cifrado débiles.',
      recommendation: 'Actualiza la configuración de tu servidor para usar TLS 1.2 o 1.3 con suites de cifrado fuertes.'
    },
    noHttpsRedirect: {
      title: 'Redirección HTTPS Faltante',
      description: 'El sitio web no redirige el tráfico HTTP a HTTPS.',
      recommendation: 'Configura tu servidor web para redirigir automáticamente todo el tráfico HTTP a HTTPS.'
    }
  },

  webSecurity: {
    starting: '🌐 Iniciando escaneo de seguridad web para:',
    completed: '✅ Escaneo de seguridad web completado para',
    noHttpsRedirect: {
      title: 'Redirección HTTPS Faltante',
      description: 'El sitio web no redirige el tráfico HTTP a HTTPS, permitiendo conexiones inseguras.',
      recommendation: 'Configura tu servidor web para redirigir automáticamente todo el tráfico HTTP a HTTPS.'
    },
    missingHsts: {
      title: 'Header HSTS Faltante',
      description: 'El header HTTP Strict Transport Security está faltante, haciendo las conexiones vulnerables a ataques de degradación.',
      recommendation: 'Agrega el header "Strict-Transport-Security: max-age=31536000; includeSubDomains" a la configuración de tu servidor.'
    },
    weakHsts: {
      title: 'Configuración HSTS Débil',
      description: 'El max-age de HSTS es muy corto. Considera usar al menos 1 año.',
      recommendation: 'Aumenta el max-age de HSTS a al menos 31536000 segundos (1 año).'
    },
    missingCsp: {
      title: 'Política de Seguridad de Contenido Faltante',
      description: 'No se encontró header Content Security Policy, dejando el sitio vulnerable a ataques XSS e inyección de código.',
      recommendation: 'Implementa un header Content Security Policy para prevenir ataques XSS. Comienza con "Content-Security-Policy: default-src \'self\'".'
    },
    weakCsp: {
      title: 'Política de Seguridad de Contenido Débil',
      description: 'CSP contiene directivas inseguras (unsafe-inline o unsafe-eval) que reducen la efectividad de seguridad.',
      recommendation: 'Remueve unsafe-inline y unsafe-eval de tu CSP y usa nonces o hashes en su lugar.'
    },
    missingFrameOptions: {
      title: 'Header X-Frame-Options Faltante',
      description: 'El header X-Frame-Options está faltante, haciendo el sitio vulnerable a ataques de clickjacking.',
      recommendation: 'Agrega el header "X-Frame-Options: DENY" o "X-Frame-Options: SAMEORIGIN" para prevenir clickjacking.'
    },
    missingContentType: {
      title: 'Header X-Content-Type-Options Faltante',
      description: 'El header X-Content-Type-Options está faltante, permitiendo ataques de sniffing de tipo MIME.',
      recommendation: 'Agrega el header "X-Content-Type-Options: nosniff" para prevenir el sniffing MIME.'
    },
    missingXssProtection: {
      title: 'Header X-XSS-Protection Faltante',
      description: 'El header X-XSS-Protection está faltante, deshabilitando el filtrado XSS del navegador.',
      recommendation: 'Agrega el header "X-XSS-Protection: 1; mode=block" para habilitar el filtrado XSS.'
    }
  },
  
  general: {
    scanStarting: (domain: string) => `🚀 Iniciando escaneo completo de seguridad para: ${domain}`,
    scanResults: '📊 RESULTADOS DEL ESCANEO',
    domain: 'Dominio',
    overallScore: 'Puntaje General',
    timestamp: 'Fecha y Hora',
    individualScores: '📈 Puntajes Individuales',
    dnsSecurityDetails: '🔍 Detalles de Seguridad DNS',
    sslCertificateDetails: '🔒 Detalles del Certificado SSL',
    webSecurityDetails: '🌐 Detalles de Seguridad Web',
    securityFindings: '⚠️  HALLAZGOS DE SEGURIDAD',
    noIssuesFound: '🎉 ¡No se encontraron problemas de seguridad!',
    scanFailed: (error: string) => `❌ Falló el escaneo: ${error}`,
    
    validCertificate: 'Certificado Válido',
    httpsRedirect: 'Redirección HTTPS',
    expires: 'Vence',
    issuer: 'Emisor',
    days: 'días'
  }
};
