# Security System for PYMEs

Sistema de monitoreo de seguridad digital para pequeñas y medianas empresas.

## 🎯 Descripción

Plataforma SaaS que permite a las PYMEs obtener una evaluación clara de su salud de seguridad digital, incluyendo configuración de correo, certificados SSL, headers de seguridad y puertos expuestos.

## 🏗️ Arquitectura del Monorepo

```
security-system-pyme/
├── apps/
│   ├── api/          # Backend NestJS + GraphQL + Prisma
│   ├── web/          # Frontend React + Vite + Material-UI
│   └── workers/      # Workers para escaneos de seguridad
├── packages/
│   └── shared/       # Tipos y utilidades compartidas
└── docker/           # Configuraciones Docker
```

## 🛠️ Stack Tecnológico

### Frontend
- **React 18** con TypeScript
- **Vite** como bundler
- **Material-UI (MUI)** para componentes
- **Apollo Client** para GraphQL
- **React Router** para navegación

### Backend
- **NestJS** con TypeScript
- **GraphQL** con Apollo Server
- **Prisma** como ORM
- **PostgreSQL** como base de datos
- **JWT** para autenticación

### Workers
- **Node.js** para escaneos de seguridad
- **Bull** para manejo de colas
- **Redis** para caché y colas

### DevOps
- **Docker** y **Docker Compose**
- **ESLint** y **Prettier**
- **Husky** para git hooks

## 🚀 Desarrollo

### Prerrequisitos
- Node.js >= 18
- npm >= 9
- Docker y Docker Compose
- PostgreSQL (o usar Docker)

### Instalación

```bash
# Instalar dependencias
npm install

# Configurar base de datos
npm run db:push

# Ejecutar en modo desarrollo
npm run dev
```

### Scripts Disponibles

```bash
npm run dev          # Ejecutar todos los servicios en desarrollo
npm run dev:api      # Solo el backend
npm run dev:web      # Solo el frontend
npm run dev:workers  # Solo los workers

npm run build        # Construir todos los proyectos
npm run lint         # Linting en todos los proyectos
npm run test         # Tests en todos los proyectos

# Base de datos
npm run db:generate  # Generar cliente Prisma
npm run db:push      # Sincronizar schema con DB
npm run db:migrate   # Ejecutar migraciones
npm run db:studio    # Abrir Prisma Studio
```

## 📦 Funcionalidades MVP

### ✅ Chequeos de Seguridad
- **Correo**: SPF, DKIM, DMARC
- **Web**: SSL, HTTPS, Headers de seguridad
- **Puertos**: Escaneo de puertos comunes

### 📊 Dashboard
- Health Score (0-100)
- Lista de hallazgos priorizados
- Sistema de tareas (TODO/Done)
- Exportación a PDF

### 🔔 Notificaciones
- Email semanal con resumen
- Alertas críticas inmediatas

### 💳 Monetización
- Trial gratuito de 14 días
- Plan Starter: USD 29/mes
- Integración con Stripe

## 🏢 Multi-tenant

Soporte básico para múltiples empresas por usuario.

## 📝 Licencia

Propietario - Todos los derechos reservados
