// Design System - Colores y constantes para coherencia visual

export const SEVERITY_COLORS = {
  critical: {
    main: '#d32f2f', // Rojo crítico
    light: '#ffebee',
    dark: '#b71c1c',
    contrastText: '#ffffff'
  },
  high: {
    main: '#f57c00', // Naranja alto
    light: '#fff3e0',
    dark: '#e65100',
    contrastText: '#ffffff'
  },
  medium: {
    main: '#fbc02d', // Amarillo medio
    light: '#fffde7',
    dark: '#f57f17',
    contrastText: '#000000'
  },
  low: {
    main: '#1976d2', // Azul bajo
    light: '#e3f2fd',
    dark: '#0d47a1',
    contrastText: '#ffffff'
  },
  info: {
    main: '#0288d1', // Azul info
    light: '#e1f5fe',
    dark: '#01579b',
    contrastText: '#ffffff'
  }
};

export const HEALTH_SCORE_COLORS = {
  excellent: {
    main: '#2e7d32', // Verde excelente (80-100)
    light: '#e8f5e8',
    gradient: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
    label: 'Excelente',
    icon: '🛡️'
  },
  good: {
    main: '#388e3c', // Verde bueno (60-79)
    light: '#e8f5e8',
    gradient: 'linear-gradient(135deg, #8bc34a 0%, #388e3c 100%)',
    label: 'Bueno',
    icon: '✅'
  },
  warning: {
    main: '#f57c00', // Naranja advertencia (40-59)
    light: '#fff3e0',
    gradient: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
    label: 'Requiere Atención',
    icon: '⚠️'
  },
  critical: {
    main: '#d32f2f', // Rojo crítico (0-39)
    light: '#ffebee',
    gradient: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
    label: 'Crítico',
    icon: '🚨'
  }
};

export const STATUS_COLORS = {
  active: {
    main: '#2e7d32',
    light: '#e8f5e8',
    label: 'Activo'
  },
  inactive: {
    main: '#757575',
    light: '#f5f5f5',
    label: 'Inactivo'
  },
  completed: {
    main: '#2e7d32',
    light: '#e8f5e8',
    label: 'Completado'
  },
  running: {
    main: '#1976d2',
    light: '#e3f2fd',
    label: 'En Proceso'
  },
  failed: {
    main: '#d32f2f',
    light: '#ffebee',
    label: 'Fallido'
  }
};

// Funciones helper
export const getSeverityColor = (severity: string) => {
  const normalizedSeverity = severity.toLowerCase() as keyof typeof SEVERITY_COLORS;
  return SEVERITY_COLORS[normalizedSeverity] || SEVERITY_COLORS.info;
};

export const getHealthScoreTheme = (score: number) => {
  if (score >= 80) return HEALTH_SCORE_COLORS.excellent;
  if (score >= 60) return HEALTH_SCORE_COLORS.good;
  if (score >= 40) return HEALTH_SCORE_COLORS.warning;
  return HEALTH_SCORE_COLORS.critical;
};

export const getSeverityIcon = (severity: string) => {
  switch (severity.toLowerCase()) {
    case 'critical': return '🚨';
    case 'high': return '⚠️';
    case 'medium': return '⚡';
    case 'low': return 'ℹ️';
    default: return '📋';
  }
};

export const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'email_security': return '📧';
    case 'ssl_certificate': return '🔒';
    case 'security_headers': return '🛡️';
    case 'port_scan': return '🌐';
    default: return '🔍';
  }
};

// Gradientes para cards de métricas
export const METRIC_GRADIENTS = {
  assets: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  healthScore: (score: number) => getHealthScoreTheme(score).gradient,
  vulnerabilities: 'linear-gradient(135deg, #fc466b 0%, #3f5efb 100%)',
  scans: 'linear-gradient(135deg, #3facf3 0%, #5b97c7 100%)'
};
