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
