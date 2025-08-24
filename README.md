# Security System for PYMEs (System Vulnes)

Sistema completo de monitoreo de seguridad digital para pequeñas y medianas empresas con 4 pilares de análisis de seguridad.

## 🎯 Descripción

Plataforma SaaS que permite a las PYMEs obtener una evaluación integral de su postura de seguridad digital. El sistema analiza 4 áreas críticas: configuración DNS/email, certificados SSL, headers de seguridad web y exposición de puertos de red.

### 🛡️ Los 4 Pilares de Seguridad

1. **🔍 DNS Security**: Validación de registros SPF, DKIM y DMARC para protección contra spoofing
2. **🔒 SSL Certificate**: Verificación de certificados, expiración y configuración HTTPS
3. **🌐 Web Security**: Análisis de headers HTTP de seguridad (HSTS, CSP, X-Frame-Options, etc.)
4. **🔍 Port Scanner**: Escaneo de 20 puertos comunes con categorización de riesgos

### 📊 Sistema de Scoring
- **Puntuación 0-100** por cada pilar de seguridad
- **Score general promedio** de los 4 componentes
- **Categorización de riesgos**: CRITICAL, HIGH, MEDIUM, LOW
- **Recomendaciones específicas** por problema detectado

## 🏗️ Arquitectura del Monorepo

```
system-vulnes/
├── apps/
│   ├── api/          # Backend NestJS + GraphQL + Prisma
│   ├── web/          # Frontend React + Vite + Apollo Client
│   └── workers/      # ✅ Workers de seguridad COMPLETOS
│       ├── src/
│       │   ├── services/
│       │   │   ├── dns.service.ts           # ✅ SPF, DKIM, DMARC
│       │   │   ├── ssl.service.ts           # ✅ Certificados SSL
│       │   │   ├── web-security.service.ts  # ✅ Headers HTTP
│       │   │   └── port-scanner.service.ts  # ✅ NUEVO: 20 puertos
│       │   ├── workers/
│       │   │   ├── dns-security.worker.ts   # ✅ Worker DNS
│       │   │   ├── ssl-certificate.worker.ts # ✅ Worker SSL
│       │   │   ├── web-security.worker.ts   # ✅ Worker Web
│       │   │   └── port-scanner.worker.ts   # ✅ NUEVO: Worker Ports
│       │   ├── i18n/                        # ✅ Español + Inglés
│       │   └── main.ts                      # ✅ Orquestador 4 pilares
├── packages/
│   └── shared/       # Tipos y utilidades compartidas
├── docker/           # Configuraciones Docker
└── docs/             # ✅ NUEVO: Documentación detallada
    └── PORT_SCANNER.md  # Documentación del Port Scanner
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

### Workers de Seguridad ✅ COMPLETOS
- **Node.js** con TypeScript para escaneos paralelos
- **4 servicios especializados** por área de seguridad
- **Sistema i18n completo** (Español/Inglés)
- **Scoring unificado** 0-100 por componente
- **Bull** para manejo de colas (próximo)
- **Redis** para caché y colas (próximo)

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
# Clonar repositorio
git clone https://github.com/martuwilson/system-vulnes.git
cd system-vulnes

# Instalar dependencias
npm install

# Configurar base de datos (próximo)
npm run db:push

# ✅ TESTING INMEDIATO - Motor de Seguridad
cd apps/workers
npm install
npm run test -- example.com es    # Escanear en español
npm run test -- github.com en     # Escanear en inglés

# Ejecutar en modo desarrollo (próximo)
npm run dev
```

### 🧪 Testing del Motor de Seguridad

El sistema está listo para testing inmediato:

```bash
cd apps/workers

# Escaneo completo en español (target PYME)
npm run test -- laburen.com es

# Escaneo completo en inglés  
npm run test -- github.com en

# Resultados del testing real:
# 📊 GitHub.com: 98/100 (excelente configuración empresarial)
# 📊 Laburen.com: 71/100 (detecta problemas reales de headers web)
```

### Scripts Disponibles

```bash
npm run dev          # Ejecutar todos los servicios en desarrollo (próximo)
npm run dev:api      # Solo el backend (próximo)
npm run dev:web      # Solo el frontend (próximo)
npm run dev:workers  # Solo los workers (próximo)

# ✅ DISPONIBLE AHORA - Testing del Motor de Seguridad
cd apps/workers
npm run test -- <domain> <language>  # Escaneo completo de los 4 pilares

npm run build        # Construir todos los proyectos
npm run lint         # Linting en todos los proyectos
npm run test         # Tests en todos los proyectos (próximo)

# Base de datos (próximo)
npm run db:generate  # Generar cliente Prisma
npm run db:push      # Sincronizar schema con DB
npm run db:migrate   # Ejecutar migraciones
npm run db:studio    # Abrir Prisma Studio
```

## 📦 Estado del MVP

### ✅ MOTOR DE SEGURIDAD COMPLETO (Phase 1)

#### 🔍 Chequeos de Seguridad - 4 Pilares
- **✅ DNS Security**: SPF, DKIM, DMARC con validación completa
- **✅ SSL Certificate**: Verificación, expiración, configuración HTTPS
- **✅ Web Security**: Headers HTTP (HSTS, CSP, X-Frame-Options, etc.)
- **✅ Port Scanner**: 20 puertos comunes con categorización de riesgos (HIGH/MEDIUM/LOW)

#### 🌐 Internacionalización Completa
- **✅ Español**: Perfecto para mercado PYME objetivo
- **✅ Inglés**: Para expansión internacional
- **✅ Mensajes específicos** por tipo de problema de seguridad
- **✅ Fallbacks robustos** sin errores

#### 📊 Sistema de Scoring Unificado
- **✅ Puntuación 0-100** por cada pilar
- **✅ Score general promedio** ponderado de los 4 componentes
- **✅ Categorización**: CRITICAL, HIGH, MEDIUM, LOW
- **✅ Recomendaciones específicas** en ambos idiomas

### 🚧 PRÓXIMAS PHASES

#### Phase 2: Backend Integration
- **🔲 API GraphQL**: Conectar workers con NestJS
- **🔲 Base de datos**: Persistir escaneos históricos con Prisma
- **🔲 Autenticación**: JWT + usuarios multi-tenant
- **🔲 Colas**: Bull + Redis para escaneos programados

#### Phase 3: Frontend Dashboard
- **� Dashboard React**: Visualización de resultados
- **🔲 Health Score visual**: Componentes MUI
- **🔲 Lista de tareas**: TODO/Done por hallazgo
- **🔲 Exportación PDF**: Reportes empresariales

#### Phase 4: Monetización
- **🔲 Trial gratuito**: 14 días
- **🔲 Plan Starter**: USD 29/mes
- **🔲 Integración Stripe**: Pagos automáticos
- **🔲 Notificaciones**: Email semanal + alertas críticas

### 📊 Testing Validation
```bash
# Resultados reales probados:
GitHub.com:  98/100 (DNS:100, SSL:100, Web:100, Ports:90)
Laburen.com: 71/100 (DNS:85,  SSL:75,  Web:25,  Ports:100)
```

## 🎯 Target Market

### 🏢 PYMEs (Pequeñas y Medianas Empresas)
- **Mercado primario**: Argentina, América Latina
- **Sector objetivo**: Empresas con presencia web que necesitan mejorar su seguridad
- **Propuesta de valor**: Diagnóstico simple de seguridad sin conocimiento técnico
- **Precio accesible**: USD 29/mes (competitivo vs consultores IT)

## 🚀 Getting Started

### Opción 1: Testing Inmediato (Recomendado)
```bash
git clone https://github.com/martuwilson/system-vulnes.git
cd system-vulnes/apps/workers
npm install
npm run test -- tudominio.com es  # ¡Prueba tu propio dominio!
```

### Opción 2: Desarrollo Completo (Próximo)
```bash
# Full stack development (Phase 2+)
npm install
npm run dev  # API + Frontend + Workers
```

## � Documentación

- **[Motor de Seguridad](apps/workers/)** - Workers Node.js completos
- **[Port Scanner](docs/PORT_SCANNER.md)** - Documentación detallada del escáner de puertos
- **[API GraphQL](apps/api/)** - Backend NestJS (próximo)
- **[Frontend React](apps/web/)** - Dashboard web (próximo)

## 🤝 Contributing

Este es un proyecto privado en desarrollo. Para colaboraciones contactar al owner.

## �📝 Licencia

Propietario - Todos los derechos reservados

---

## 🏆 Status: MOTOR DE SEGURIDAD COMPLETO ✅

**El core del MVP está funcionando al 100%**. Los 4 pilares de seguridad están implementados, probados y listos para integración con el resto de la arquitectura.

**Próximo milestone**: API GraphQL + Base de datos para convertir en SaaS completo.
