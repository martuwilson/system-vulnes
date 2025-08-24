import { Messages, SupportedLanguage } from './types';
import { enMessages } from './en';
import { esMessages } from './es';

export class I18nService {
  private messages: Record<SupportedLanguage, Messages> = {
    en: enMessages,
    es: esMessages
  };

  private currentLanguage: SupportedLanguage = 'en';

  /**
   * Configura el idioma actual
   */
  setLanguage(language: SupportedLanguage): void {
    this.currentLanguage = language;
  }

  /**
   * Obtiene el idioma actual
   */
  getLanguage(): SupportedLanguage {
    return this.currentLanguage;
  }

  /**
   * Obtiene los mensajes para el idioma actual
   */
  getMessages(): Messages {
    return this.messages[this.currentLanguage];
  }

  /**
   * Detecta el idioma basado en el header Accept-Language o navegador
   */
  detectLanguage(acceptLanguage?: string): SupportedLanguage {
    if (!acceptLanguage) {
      return 'en'; // Default a inglés
    }

    // Parsear Accept-Language header
    const languages = acceptLanguage
      .split(',')
      .map(lang => lang.split(';')[0].trim().toLowerCase())
      .map(lang => lang.split('-')[0]); // Tomar solo el código de idioma principal

    // Buscar el primer idioma soportado
    for (const lang of languages) {
      if (lang === 'es' || lang === 'spa') {
        return 'es';
      }
      if (lang === 'en' || lang === 'eng') {
        return 'en';
      }
    }

    return 'en'; // Default a inglés si no se encuentra coincidencia
  }

  /**
   * Configura el idioma automáticamente basado en Accept-Language
   */
  autoSetLanguage(acceptLanguage?: string): void {
    const detectedLanguage = this.detectLanguage(acceptLanguage);
    this.setLanguage(detectedLanguage);
  }
}

// Instancia singleton para uso global
export const i18n = new I18nService();
