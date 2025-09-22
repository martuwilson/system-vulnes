# Configuración de Producción MVP

## Variables de Entorno Requeridas

### Backend (API)
```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/db_name"

# JWT
JWT_SECRET="your-super-secure-jwt-secret-min-32-chars"
JWT_EXPIRES_IN="24h"

# Redis (para colas)
REDIS_URL="redis://localhost:6379"

# Server
PORT=3001
NODE_ENV="production"

# Cors
CORS_ORIGIN="https://yourdomain.com"

# Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=900000
```

### Frontend (Web)
```bash
# API Endpoint
VITE_API_URL="https://api.yourdomain.com/graphql"

# Environment
NODE_ENV="production"
```

## Setup de Producción

### 1. Base de Datos
- [ ] PostgreSQL configurado
- [ ] Migraciones aplicadas: `npx prisma migrate deploy`
- [ ] Seed data (opcional): `npx prisma db seed`

### 2. Redis
- [ ] Instancia Redis funcionando
- [ ] Configuración de persistencia

### 3. Backend
- [ ] Variables de entorno configuradas
- [ ] Build: `npm run build`
- [ ] Start: `npm run start:prod`

### 4. Frontend  
- [ ] Variables de entorno configuradas
- [ ] Build: `npm run build`
- [ ] Deploy estático (Vercel/Netlify)

## Comandos de Verificación

```bash
# Test E2E completo
node test-e2e-mvp.js

# Verificar servicios
curl http://localhost:3001/graphql -X POST -H "Content-Type: application/json" -d '{"query":"query { __schema { types { name } } }"}'

# Health check
curl http://localhost:3000/
```
