// Sistema de traducción para términos técnicos del backend
// Los workers pueden enviar datos en inglés o español, aquí normalizamos todo al español

// Traducciones de categorías de vulnerabilidades
export const CATEGORY_TRANSLATIONS = {
  // Inglés -> Español
  'email_security': 'Seguridad de Email',
  'ssl_certificate': 'Certificado SSL',
  'security_headers': 'Headers de Seguridad',
  'port_scan': 'Escaneo de Puertos',
  'dns_security': 'Seguridad DNS',
  'web_security': 'Seguridad Web',
  
  // Español (mantener igual)
  'seguridad_email': 'Seguridad de Email',
  'certificado_ssl': 'Certificado SSL',
  'headers_seguridad': 'Headers de Seguridad',
  'escaneo_puertos': 'Escaneo de Puertos',
  'seguridad_dns': 'Seguridad DNS',
  'seguridad_web': 'Seguridad Web',
} as const;

// Traducciones de severidad
export const SEVERITY_TRANSLATIONS = {
  // Inglés -> Español
  'critical': 'Crítica',
  'high': 'Alta',
  'medium': 'Media',
  'low': 'Baja',
  'info': 'Información',
  
  // Español (mantener igual)
  'crítica': 'Crítica',
  'alta': 'Alta',
  'media': 'Media',
  'baja': 'Baja',
  'información': 'Información',
} as const;

// Traducciones de estados
export const STATUS_TRANSLATIONS = {
  // Inglés -> Español
  'pending': 'Pendiente',
  'running': 'En Proceso',
  'completed': 'Completado',
  'failed': 'Fallido',
  'cancelled': 'Cancelado',
  'queued': 'En Cola',
  
  // Español (mantener igual)
  'pendiente': 'Pendiente',
  'en_proceso': 'En Proceso',
  'completado': 'Completado',
  'fallido': 'Fallido',
  'cancelado': 'Cancelado',
  'en_cola': 'En Cola',
} as const;

// Traducciones de títulos de vulnerabilidades comunes
export const VULNERABILITY_TITLE_TRANSLATIONS = {
  // SSL/TLS
  'SSL Certificate Expired': 'Certificado SSL Expirado',
  'SSL Certificate Invalid': 'Certificado SSL Inválido',
  'Weak SSL/TLS Configuration': 'Configuración SSL/TLS Débil',
  'Self-Signed Certificate': 'Certificado Auto-firmado',
  'Certificate Chain Issues': 'Problemas en la Cadena de Certificados',
  
  // Security Headers
  'Missing Security Headers': 'Headers de Seguridad: Faltantes',
  'Strict-Transport-Security Missing': 'Strict-Transport-Security: Faltante',
  'X-Frame-Options Missing': 'X-Frame-Options: Faltante',
  'X-Frame-Options Header Missing': 'X-Frame-Options: Faltante',
  'X-Content-Type-Options Missing': 'X-Content-Type-Options: Faltante',
  'Content-Security-Policy Missing': 'Content-Security-Policy: Faltante',
  'Content Security Policy Issues': 'Content Security Policy: Problemas de configuración',
  'X-XSS-Protection Missing': 'X-XSS-Protection: Faltante',
  'HSTS Header Missing or Misconfigured': 'HSTS: Faltante o mal configurada',
  
  // Port Security
  'Open Port Detected': 'Puerto Abierto Detectado',
  'Unnecessary Service Running': 'Servicio Innecesario Ejecutándose',
  'Vulnerable Service Version': 'Versión de Servicio Vulnerable',
  'Insecure Port Configuration': 'Configuración de Puerto Insegura',
  'Web Service on Non-Standard Port 8080': 'Servicio Web en Puerto No Estándar 8080',
  'Web Service on Non-Standard Port 8443': 'Servicio Web en Puerto No Estándar 8443',
  'Web Service on Non-Standard Port 3000': 'Servicio Web en Puerto No Estándar 3000',
  'Web Service on Non-Standard Port 3001': 'Servicio Web en Puerto No Estándar 3001',
  'Web Service on Non-Standard Port 4000': 'Servicio Web en Puerto No Estándar 4000',
  'Web Service on Non-Standard Port 5000': 'Servicio Web en Puerto No Estándar 5000',
  'Web Service on Non-Standard Port 8000': 'Servicio Web en Puerto No Estándar 8000',
  'Web Service on Non-Standard Port 9000': 'Servicio Web en Puerto No Estándar 9000',
  
  // DNS Security
  'DNS Configuration Issue': 'DNS: Problema de configuración',
  'Missing SPF Record': 'SPF: Registro faltante',
  'Missing DMARC Record': 'DMARC: Registro faltante',
  'DMARC Policy Issues': 'DMARC: Problemas de política',
  'DNS Vulnerability': 'DNS: Vulnerabilidad detectada',
  
  // Web Security
  'SQL Injection Vulnerability': 'Vulnerabilidad de Inyección SQL',
  'Cross-Site Scripting (XSS)': 'Cross-Site Scripting (XSS)',
  'Insecure Authentication': 'Autenticación Insegura',
  'Directory Traversal': 'Traversal de Directorio',
  'Information Disclosure': 'Divulgación de Información',
  'Weak Password Policy': 'Política de Contraseñas Débil',
  
  // Email Security
  'Email Security Issue': 'Problema de Seguridad de Email',
  'SMTP Configuration Issue': 'Problema de Configuración SMTP',
  'Email Spoofing Vulnerability': 'Vulnerabilidad de Spoofing de Email',
  
  // General
  'Security Vulnerability': 'Vulnerabilidad de Seguridad',
  'Configuration Issue': 'Problema de Configuración',
  'Security Risk': 'Riesgo de Seguridad',
  'Potential Threat': 'Amenaza Potencial',
  'Security Warning': 'Advertencia de Seguridad',
  'Network Security Issue': 'Problema de Seguridad de Red',
  'Application Security Issue': 'Problema de Seguridad de Aplicación',
  'System Vulnerability': 'Vulnerabilidad del Sistema',
} as const;

// Traducciones de descripciones comunes
export const VULNERABILITY_DESCRIPTION_TRANSLATIONS = {
  // Patrones comunes en descripciones - SSL/TLS
  'The SSL certificate has expired': 'El certificado SSL ha expirado',
  'SSL certificate is not valid': 'El certificado SSL no es válido',
  'Weak SSL/TLS configuration detected': 'Configuración SSL/TLS débil detectada',
  'Certificate chain is incomplete': 'La cadena de certificados está incompleta',
  'Self-signed certificate detected': 'Certificado auto-firmado detectado',
  
  // Security Headers
  'Missing security header': 'Header de seguridad faltante',
  'Security header not implemented': 'Header de seguridad no implementado',
  'Improper security header configuration': 'Configuración incorrecta de header de seguridad',
  'Recommended security headers are missing': 'Headers de seguridad recomendados están faltantes',
  'HSTS header is faltante': 'La cabecera HSTS falta',
  'This allows downgrade attacks from HTTPS to HTTP': 'Esto permite ataques de degradación de HTTPS a HTTP',
  'Add "Strict-Transport-Security: max-age=31536000; includeSubDomains; preload" header to force HTTPS connections': 'Agregue la cabecera "Strict-Transport-Security: max-age=31536000; includeSubDomains; preload" para forzar conexiones HTTPS',
  'Content seguridad Policy header is faltante': 'La cabecera de Política de Seguridad de Contenido falta',
  'leaving the site vulnerable to XSS attacks': 'dejando el sitio vulnerable a ataques XSS',
  'Implement a CSP header starting with "default-src \'self\'" and gradually refine it': 'Implemente una cabecera CSP comenzando con "default-src \'self\'" y refínela gradualmente',
  'faltante X-Frame-Options header allows the page to be embedded in iframes': 'La cabecera X-Frame-Options faltante permite que la página sea incrustada en iframes',
  'potentially enabling clickjacking attacks': 'potencialmente habilitando ataques de clickjacking',
  
  // DNS/Email Security
  'Domain': 'Dominio',
  'DMARC lookup failed': 'Falló la búsqueda DMARC',
  'queryTxt ENOTFOUND': 'consulta TXT no encontrada',
  'Configure a DMARC policy starting with "p=none" to monitor email authentication': 'Configure una política DMARC comenzando con "p=none" para monitorear la autenticación de email',
  'then gradually enforce with "p=quarantine" or "p=reject"': 'luego gradualmente aplique con "p=quarantine" o "p=reject"',
  
  // Port/Network
  'Open port detected on': 'Puerto abierto detectado en',
  'Unnecessary service running on port': 'Servicio innecesario ejecutándose en puerto',
  'Vulnerable service version detected': 'Versión vulnerable de servicio detectada',
  'Network service misconfiguration': 'Configuración incorrecta de servicio de red',
  'Web service detected on non-standard port': 'Servicio web detectado en puerto no estándar',
  'This might be intentional but could indicate a development or admin interface': 'Esto podría ser intencional pero podría indicar una interfaz de desarrollo o administración',
  'Verify that the service on port': 'Verifique que el servicio en el puerto',
  'is intended for public access and properly secured': 'esté destinado para acceso público y esté debidamente asegurado',
  
  // Web Security
  'SQL injection vulnerability found': 'Vulnerabilidad de inyección SQL encontrada',
  'Cross-site scripting vulnerability': 'Vulnerabilidad de cross-site scripting',
  'Authentication bypass possible': 'Bypass de autenticación posible',
  'Sensitive information exposed': 'Información sensible expuesta',
  
  // General patterns
  'Weak encryption detected': 'Cifrado débil detectado',
  'Insecure configuration found': 'Configuración insegura encontrada',
  'Vulnerability detected in': 'Vulnerabilidad detectada en',
  'Security risk identified': 'Riesgo de seguridad identificado',
  'Potential security issue': 'Posible problema de seguridad',
  'Recommended to fix': 'Recomendado corregir',
  'Update required': 'Actualización requerida',
  'Configuration should be changed': 'La configuración debería cambiarse',
  'Immediate action required': 'Acción inmediata requerida',
  'This vulnerability should be addressed': 'Esta vulnerabilidad debería ser atendida',
  'Consider implementing': 'Considere implementar',
  'It is recommended to': 'Se recomienda',
  'Please update': 'Por favor actualice',
  'Fix this issue': 'Corrija este problema',
} as const;

// Funciones de traducción
export function translateCategory(category: string): string {
  const normalized = category.toLowerCase().trim();
  return CATEGORY_TRANSLATIONS[normalized as keyof typeof CATEGORY_TRANSLATIONS] || category;
}

export function translateSeverity(severity: string): string {
  const normalized = severity.toLowerCase().trim();
  return SEVERITY_TRANSLATIONS[normalized as keyof typeof SEVERITY_TRANSLATIONS] || severity;
}

export function translateStatus(status: string): string {
  const normalized = status.toLowerCase().trim();
  return STATUS_TRANSLATIONS[normalized as keyof typeof STATUS_TRANSLATIONS] || status;
}

// Función para traducir títulos de vulnerabilidades
export function translateVulnerabilityTitle(title: string): string {
  if (!title) return title;
  
  // Buscar traducción exacta
  const exactMatch = VULNERABILITY_TITLE_TRANSLATIONS[title as keyof typeof VULNERABILITY_TITLE_TRANSLATIONS];
  if (exactMatch) {
    return exactMatch;
  }
  
  // Si no hay traducción exacta, retornar el original
  return title;
}

// Función para traducir descripciones de vulnerabilidades
export function translateVulnerabilityDescription(description: string): string {
  if (!description) return description;
  
  let translatedDescription = description;
  
  // Buscar y reemplazar patrones comunes (más específicos primero)
  Object.entries(VULNERABILITY_DESCRIPTION_TRANSLATIONS).forEach(([english, spanish]) => {
    const regex = new RegExp(english.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    translatedDescription = translatedDescription.replace(regex, spanish);
  });
  
  // Traducciones específicas para descripciones completas
  
  // DMARC
  if (translatedDescription.includes('DMARC lookup failed') && translatedDescription.includes('queryTxt ENOTFOUND')) {
    translatedDescription = translatedDescription.replace(/Domain ([^\s]+) DMARC lookup failed: queryTxt ENOTFOUND ([^\s]+)/, 'Falló la búsqueda DMARC del dominio $1: consulta TXT no encontrada $2');
  }
  
  // HSTS Header
  if (translatedDescription.includes('HSTS header is faltante') && translatedDescription.includes('downgrade attacks')) {
    translatedDescription = 'La cabecera HSTS falta. Esto permite ataques de degradación de HTTPS a HTTP.';
  }
  
  // Content Security Policy
  if (translatedDescription.includes('Content seguridad Policy header is faltante') && translatedDescription.includes('XSS attacks')) {
    translatedDescription = 'La cabecera de Política de Seguridad de Contenido falta, dejando el sitio vulnerable a ataques XSS.';
  }
  
  // X-Frame-Options
  if (translatedDescription.includes('faltante X-Frame-Options header') && translatedDescription.includes('clickjacking')) {
    translatedDescription = 'La cabecera X-Frame-Options faltante permite que la página sea incrustada en iframes, potencialmente habilitando ataques de clickjacking.';
  }
  
  // Web service patterns
  if (translatedDescription.includes('Web service detected on non-standard port') && 
      translatedDescription.includes('This might be intentional but could indicate a development or admin interface')) {
    const portMatch = translatedDescription.match(/port (\d+)/);
    const port = portMatch ? portMatch[1] : '';
    translatedDescription = `Servicio web detectado en puerto no estándar ${port}. Esto podría ser intencional pero podría indicar una interfaz de desarrollo o administración.`;
  }
  
  if (translatedDescription.includes('Verify that the service on port') && 
      translatedDescription.includes('is intended for public access and properly secured')) {
    const portMatch = translatedDescription.match(/port (\d+)/);
    const port = portMatch ? portMatch[1] : '';
    translatedDescription = `Verifique que el servicio en el puerto ${port} esté destinado para acceso público y esté debidamente asegurado.`;
  }
  
  // Si la descripción sigue siendo muy similar al original y parece estar en inglés,
  // aplicar traducciones de palabras clave comunes
  if (translatedDescription === description && /^[a-zA-Z\s.,!?-]+$/.test(description)) {
    const keywordTranslations = {
      'certificate': 'certificado',
      'expired': 'expirado',
      'invalid': 'inválido',
      'missing': 'faltante',
      'vulnerability': 'vulnerabilidad',
      'security': 'seguridad',
      'configuration': 'configuración',
      'detected': 'detectado',
      'recommended': 'recomendado',
      'required': 'requerido',
      'issue': 'problema',
      'warning': 'advertencia',
      'error': 'error',
      'risk': 'riesgo',
      'threat': 'amenaza',
      'update': 'actualizar',
      'fix': 'corregir',
      'implement': 'implementar',
      'consider': 'considere',
      'please': 'por favor',
      'should': 'debería',
      'must': 'debe',
      'port': 'puerto',
      'service': 'servicio',
      'header': 'header',
      'weak': 'débil',
      'strong': 'fuerte',
      'insecure': 'inseguro',
      'secure': 'seguro',
    };
    
    // Aplicar traducciones de palabras clave (mantener estructura de la frase)
    Object.entries(keywordTranslations).forEach(([en, es]) => {
      const wordRegex = new RegExp(`\\b${en}\\b`, 'gi');
      translatedDescription = translatedDescription.replace(wordRegex, es);
    });
  }
  
  return translatedDescription;
}

// Mapeo de iconos por categoría (normalizado)
export const getCategoryIconByType = (category: string) => {
  const normalized = category.toLowerCase().trim();
  switch (normalized) {
    case 'email_security':
    case 'seguridad_email':
      return '📧';
    case 'ssl_certificate':
    case 'certificado_ssl':
      return '🔒';
    case 'security_headers':
    case 'headers_seguridad':
      return '🛡️';
    case 'port_scan':
    case 'escaneo_puertos':
      return '🌐';
    case 'dns_security':
    case 'seguridad_dns':
      return '🔍';
    case 'web_security':
    case 'seguridad_web':
      return '🌐';
    default:
      return '🔍';
  }
};

// Función para formatear fechas de manera amigable
export const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const isToday = date.toDateString() === today.toDateString();
  const isYesterday = date.toDateString() === yesterday.toDateString();
  
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  };
  
  const time = date.toLocaleString('es-ES', timeOptions);
  
  if (isToday) {
    return `Hoy ${time}`;
  } else if (isYesterday) {
    return `Ayer ${time}`;
  } else {
    const dateOptions: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    };
    const dateStr = date.toLocaleString('es-ES', dateOptions);
    return `${dateStr} ${time}`;
  }
};
