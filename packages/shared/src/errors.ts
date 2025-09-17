// Centralizar manejo de errores
export enum ErrorCode {
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  SCAN_FAILED = 'SCAN_FAILED',
  RATE_LIMITED = 'RATE_LIMITED',
}

export class SecuritySystemError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'SecuritySystemError';
  }
}

export const ERROR_MESSAGES = {
  [ErrorCode.UNAUTHORIZED]: 'Acceso no autorizado',
  [ErrorCode.FORBIDDEN]: 'Acceso denegado',
  [ErrorCode.NOT_FOUND]: 'Recurso no encontrado',
  [ErrorCode.VALIDATION_ERROR]: 'Error de validación',
  [ErrorCode.SCAN_FAILED]: 'Error en el escaneo',
  [ErrorCode.RATE_LIMITED]: 'Límite de peticiones excedido',
};
