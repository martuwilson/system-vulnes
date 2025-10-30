import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export interface WelcomeEmailData {
  firstName: string;
  companyName: string;
  loginUrl: string;
}

export interface SecurityAlertEmailData {
  firstName: string;
  companyName: string;
  domain: string;
  criticalFindings: number;
  highFindings: number;
  dashboardUrl: string;
  findings: Array<{
    title: string;
    severity: string;
    description: string;
  }>;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private resend: Resend;
  private readonly fromEmail: string;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    
    if (apiKey) {
      this.resend = new Resend(apiKey);
      this.fromEmail = this.configService.get<string>('FROM_EMAIL') || 'Securyx <alerts@securyx.com>';
    } else {
      this.logger.warn('RESEND_API_KEY not configured. Email service will be disabled.');
    }
  }

  async sendEmail(template: EmailTemplate): Promise<boolean> {
    if (!this.resend) {
      this.logger.warn('Email service not configured. Skipping email send.');
      return false;
    }

    try {
      const { data, error } = await this.resend.emails.send({
        from: template.from || this.fromEmail,
        to: template.to,
        subject: template.subject,
        html: template.html,
      });

      if (error) {
        this.logger.error('Failed to send email:', error);
        return false;
      }

      this.logger.log(`Email sent successfully to ${template.to}. ID: ${data?.id}`);
      return true;
    } catch (error) {
      this.logger.error('Error sending email:', error);
      return false;
    }
  }

  async sendWelcomeEmail(email: string, data: WelcomeEmailData): Promise<boolean> {
    const template: EmailTemplate = {
      to: email,
      subject: `¡Bienvenido a Securyx, ${data.firstName}! 🚀`,
      html: this.getWelcomeEmailTemplate(data),
    };

    return this.sendEmail(template);
  }

  async sendSecurityAlert(email: string, data: SecurityAlertEmailData): Promise<boolean> {
    const urgencyLevel = data.criticalFindings > 0 ? 'CRÍTICA' : 'ALTA';
    
    const template: EmailTemplate = {
      to: email,
      subject: `🚨 Alerta ${urgencyLevel}: ${data.criticalFindings + data.highFindings} vulnerabilidades en ${data.domain}`,
      html: this.getSecurityAlertTemplate(data),
    };

    return this.sendEmail(template);
  }

  private getWelcomeEmailTemplate(data: WelcomeEmailData): string {
    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bienvenido a Securyx</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Inter', 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            line-height: 1.6; 
            color: #1E2A38; 
            background: #f8fafc;
            margin: 0; 
            padding: 20px; 
          }
          .email-container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: #ffffff; 
            border-radius: 12px; 
            overflow: hidden; 
            box-shadow: 0 8px 32px rgba(30, 42, 56, 0.08);
          }
          .header { 
            background: linear-gradient(135deg, #1E2A38 0%, #2A3A4A 100%); 
            color: white; 
            padding: 40px 30px; 
            text-align: center; 
            position: relative;
          }
          .header::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, #AEEA00 0%, #C6FF00 100%);
          }
          .header h1 { 
            margin: 0; 
            font-size: 28px; 
            font-weight: 700; 
            margin-bottom: 8px;
          }
          .header p { 
            margin: 0; 
            font-size: 16px; 
            opacity: 0.9; 
            color: #AEEA00;
          }
          .shield-icon {
            display: inline-block;
            width: 32px;
            height: 32px;
            background: #AEEA00;
            border-radius: 50%;
            margin-bottom: 16px;
            position: relative;
          }
          .shield-icon::before {
            content: '🛡️';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 18px;
          }
          .content { 
            background: #fff; 
            padding: 40px 30px; 
          }
          .content h2 {
            color: #1E2A38;
            font-size: 22px;
            font-weight: 600;
            margin-bottom: 20px;
          }
          .content p {
            margin-bottom: 16px;
            color: #475569;
            font-size: 16px;
            line-height: 1.6;
          }
          .highlight { 
            background: linear-gradient(135deg, #F0F9FF 0%, #E0F7FA 100%); 
            padding: 24px; 
            border-left: 4px solid #00B8D9; 
            margin: 24px 0; 
            border-radius: 8px;
            border: 1px solid rgba(0, 184, 217, 0.1);
          }
          .highlight h3 {
            color: #1E2A38;
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 12px;
          }
          .button { 
            display: inline-block; 
            background: linear-gradient(135deg, #AEEA00 0%, #C6FF00 100%); 
            color: #1E2A38; 
            padding: 16px 32px; 
            text-decoration: none; 
            border-radius: 8px; 
            font-weight: 600; 
            margin: 24px 0;
            font-size: 16px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(174, 234, 0, 0.3);
          }
          .button:hover { 
            background: linear-gradient(135deg, #C6FF00 0%, #AEEA00 100%); 
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(174, 234, 0, 0.4);
          }
          .features { 
            display: flex; 
            flex-wrap: wrap; 
            gap: 16px; 
            margin: 32px 0; 
          }
          .feature { 
            flex: 1; 
            min-width: 200px; 
            padding: 20px; 
            background: linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%); 
            border-radius: 8px; 
            text-align: center;
            border: 1px solid #E2E8F0;
          }
          .feature-icon { 
            font-size: 32px; 
            margin-bottom: 12px; 
            display: block;
          }
          .feature h4 {
            color: #1E2A38;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 8px;
          }
          .feature p {
            color: #64748B;
            font-size: 13px;
            margin: 0;
            line-height: 1.5;
          }
          .stats {
            background: linear-gradient(135deg, #1E2A38 0%, #2A3A4A 100%);
            color: white;
            padding: 24px;
            border-radius: 8px;
            margin: 24px 0;
            text-align: center;
          }
          .stats h3 {
            color: #AEEA00;
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 16px;
          }
          .stats-grid {
            display: flex;
            justify-content: space-around;
            flex-wrap: wrap;
            gap: 16px;
          }
          .stat-item {
            text-align: center;
          }
          .stat-number {
            font-size: 24px;
            font-weight: 700;
            color: #AEEA00;
            display: block;
          }
          .stat-label {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.8);
            margin-top: 4px;
          }
          .footer { 
            text-align: center; 
            padding: 32px 30px; 
            color: #64748B; 
            font-size: 14px; 
            background: #F8FAFC; 
            border-top: 1px solid #E2E8F0;
          }
          .footer a {
            color: #00B8D9;
            text-decoration: none;
          }
          .footer a:hover {
            text-decoration: underline;
          }
          @media (max-width: 600px) {
            .features { flex-direction: column; }
            .feature { min-width: auto; }
            .stats-grid { flex-direction: column; gap: 12px; }
            .header, .content, .footer { padding: 24px 20px; }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <div class="shield-icon"></div>
            <h1>¡Bienvenido a Securyx!</h1>
            <p>Tu protección digital empresarial comienza ahora</p>
          </div>
          
          <div class="content">
            <h2>Hola ${data.firstName},</h2>
            
            <p>¡Felicitaciones! Tu cuenta de Securyx para <strong>${data.companyName}</strong> está lista y protegida.</p>
          
          <div class="highlight">
            <h3>🎯 ¿Qué sigue?</h3>
            <ol>
              <li><strong>Inicia sesión</strong> en tu dashboard</li>
              <li><strong>Agrega tus dominios</strong> para monitorear</li>
              <li><strong>Ejecuta tu primer escaneo</strong> de seguridad</li>
              <li><strong>Revisa las alertas</strong> y recomendaciones</li>
            </ol>
          </div>

          <div class="features">
            <div class="feature">
              <div class="feature-icon">🔍</div>
              <h4>Escaneos Automáticos</h4>
              <p>Monitoreo 24/7 de tus dominios</p>
            </div>
            <div class="feature">
              <div class="feature-icon">📊</div>
              <h4>Reportes Claros</h4>
              <p>Métricas y recomendaciones accionables</p>
            </div>
            <div class="feature">
              <div class="feature-icon">🚨</div>
              <h4>Alertas Instantáneas</h4>
              <p>Notificaciones de vulnerabilidades críticas</p>
            </div>
          </div>

          <div style="text-align: center;">
            <a href="${data.loginUrl}" class="button">🚀 Acceder a mi Dashboard</a>
          </div>

          <div class="highlight">
            <h4>💡 ¿Necesitas ayuda?</h4>
            <p>Nuestro equipo está disponible en español para guiarte en tu configuración inicial.</p>
            <p>📧 <strong>soporte@securyx.com</strong></p>
          </div>
        </div>
        
        <div class="footer">
          <p>© 2025 Securyx - Protección Digital para PyMEs</p>
          <p>Este correo fue enviado porque te registraste en Securyx.</p>
        </div>
      </body>
      </html>
    `;
  }

  private getSecurityAlertTemplate(data: SecurityAlertEmailData): string {
    const findingsHtml = data.findings.map(finding => `
      <div style="padding: 15px; margin: 10px 0; border-left: 4px solid ${finding.severity === 'CRITICAL' ? '#dc3545' : '#fd7e14'}; background: ${finding.severity === 'CRITICAL' ? '#fff5f5' : '#fff8f0'}; border-radius: 4px;">
        <h4 style="margin: 0 0 8px 0; color: ${finding.severity === 'CRITICAL' ? '#dc3545' : '#fd7e14'};">
          ${finding.severity === 'CRITICAL' ? '🔴' : '🟠'} ${finding.title}
        </h4>
        <p style="margin: 0; color: #666; font-size: 14px;">${finding.description}</p>
      </div>
    `).join('');

    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Alerta de Seguridad - Securyx</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .header h1 { margin: 0; font-size: 28px; }
          .alert-badge { display: inline-block; background: rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: bold; margin-top: 10px; }
          .content { background: #fff; padding: 30px 20px; border: 1px solid #e0e0e0; }
          .stats { display: flex; gap: 20px; margin: 20px 0; }
          .stat { flex: 1; text-align: center; padding: 20px; background: #f8f9fa; border-radius: 8px; }
          .stat-number { font-size: 32px; font-weight: bold; margin-bottom: 5px; }
          .stat-critical { color: #dc3545; }
          .stat-high { color: #fd7e14; }
          .button { display: inline-block; background: #dc3545; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
          .button:hover { background: #bb2d3b; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; background: #f8f9fa; border-radius: 0 0 8px 8px; }
          .priority { background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 6px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🚨 Alerta de Seguridad</h1>
          <div class="alert-badge">REQUIERE ATENCIÓN INMEDIATA</div>
        </div>
        
        <div class="content">
          <h2>Hola ${data.firstName},</h2>
          
          <p>Hemos detectado <strong>${data.criticalFindings + data.highFindings} vulnerabilidades</strong> en <strong>${data.domain}</strong> que requieren tu atención inmediata.</p>

          <div class="stats">
            <div class="stat">
              <div class="stat-number stat-critical">${data.criticalFindings}</div>
              <div>Críticas</div>
            </div>
            <div class="stat">
              <div class="stat-number stat-high">${data.highFindings}</div>
              <div>Altas</div>
            </div>
          </div>

          <div class="priority">
            <h3>⚡ Vulnerabilidades Detectadas:</h3>
            ${findingsHtml}
          </div>

          <div style="text-align: center;">
            <a href="${data.dashboardUrl}" class="button">🔍 Ver Detalles y Soluciones</a>
          </div>

          <div style="background: #e7f3ff; padding: 20px; border-radius: 6px; margin: 20px 0;">
            <h4>📋 Próximos pasos recomendados:</h4>
            <ol>
              <li>Accede a tu dashboard para ver el análisis completo</li>
              <li>Prioriza las vulnerabilidades críticas (🔴)</li>
              <li>Implementa las recomendaciones específicas</li>
              <li>Contacta a tu equipo técnico si necesitas ayuda</li>
            </ol>
          </div>
        </div>
        
        <div class="footer">
          <p>© 2025 Securyx - Protección Digital para PyMEs</p>
          <p>📧 Si necesitas ayuda: <strong>soporte@securyx.com</strong></p>
          <p><small>Este correo fue enviado porque tienes alertas activadas para ${data.companyName}</small></p>
        </div>
      </body>
      </html>
    `;
  }
}