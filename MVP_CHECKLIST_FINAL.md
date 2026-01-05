# 🚀 MVP CHECKLIST FINAL - SECURIX v1
## Orden de Prioridad Real para Lanzamiento

> **Filosofía:** Sin monetización, no hay negocio. Sin deployment, no hay validación.  
> **Objetivo:** MVP vendible en 2-3 días de trabajo enfocado.

---

## 🔥 PRIORIDAD CRÍTICA (Bloqueantes totales)

### ❌ 1. FLUJO DE PAGO COMPLETO (8 horas)
**Sin esto, no hay producto vendible. Es un portfolio piece.**

#### Backend (✅ 90% listo)
- [x] MercadoPago service funcionando
- [x] Webhook `/mercadopago/webhook` configurado
- [x] GraphQL mutation `createPaymentPreference`
- [x] Activación automática de suscripción al pagar
- [ ] **FALTA:** Testing con tarjetas test de MercadoPago

#### Frontend (❌ 0% implementado)
- [ ] Página `/checkout` con selector de plan
- [ ] Componente `<MercadoPagoButton />` que llame a mutation
- [ ] Integración SDK MercadoPago en React
- [ ] Páginas `/payment/success`, `/payment/failure`, `/payment/pending`
- [ ] Redirección automática a `init_point` de MercadoPago

**Estimación:** 6 horas  
**Bloqueante:** SÍ - Sin esto nadie puede pagarte

---

### ❌ 2. ENFORCEMENT DE LÍMITES DE PLAN (4 horas)
**Si no bloqueás, nadie paga. Es psicología básica de conversión.**

#### Backend (❌ No existe)
- [ ] Guard `@RequireActivePlan()` antes de escaneos
- [ ] Validar límites en `SecurityResolver.startSecurityScanQueued()`
- [ ] Retornar error GraphQL con código `PLAN_LIMIT_EXCEEDED`
- [ ] Incluir en error: plan actual, límite, uso actual, planes disponibles

Lógica a implementar:
```typescript
// Plan FREE: 1 empresa, 5 escaneos/mes
// Plan STARTER: 1 empresa, escaneos ilimitados  
// Plan GROWTH: 3 empresas, escaneos ilimitados
// Plan PRO: empresas ilimitadas, escaneos ilimitados
```

#### Frontend (❌ No existe)
- [ ] Modal `<UpgradeModal />` que se dispara al recibir error
- [ ] Comparación visual de planes (tabla simple)
- [ ] Botón "Actualizar Plan" → `/checkout?plan=STARTER`
- [ ] Mensaje claro: "Llegaste al límite de X. Upgrade para continuar."

**Estimación:** 4 horas  
**Bloqueante:** SÍ - Sin esto no hay conversión FREE → PAID

---

### ❌ 3. CONECTAR LANDING → CHECKOUT (2 horas)
**Los botones decorativos no convierten.**

#### Rutas a implementar:
- [ ] Landing: "Comenzar ahora" → `/register?redirect=/checkout&plan=STARTER`
- [ ] Pricing cards: botones específicos por plan
- [ ] Dashboard: botón "Upgrade" en header si es FREE
- [ ] Modal de límites: botón directo a checkout

#### Lógica de redirección:
```
Si NO está logueado → /register?plan=STARTER → /checkout
Si está logueado → /checkout?plan=STARTER
Si tiene plan activo → /settings con mensaje "Ya tenés plan X"
```

**Estimación:** 2 horas  
**Bloqueante:** SÍ - Sin esto no hay flujo de conversión

---

### ❌ 4. DEPLOYMENT EN PRODUCCIÓN (6 horas)
**No existe si no está online.**

#### Railway - Backend (Recomendado)
- [ ] Crear proyecto en Railway
- [ ] Conectar repo GitHub (auto-deploy)
- [ ] Agregar PostgreSQL plugin (incluido)
- [ ] Agregar Redis plugin (incluido)
- [ ] Configurar variables de entorno:
  - `DATABASE_URL` (auto)
  - `REDIS_URL` (auto)
  - `JWT_SECRET` (generar 64 chars)
  - `MERCADOPAGO_ACCESS_TOKEN` (prod)
  - `MERCADOPAGO_PUBLIC_KEY` (prod)
  - `APP_URL` (https://tuapi.railway.app)
  - `FRONTEND_URL` (https://tuapp.vercel.app)
  - `USD_TO_ARS_RATE` (actualizar semanal)
- [ ] Verificar que levanta el servicio
- [ ] Copiar URL pública para webhook

#### Vercel - Frontend
- [ ] `vercel --prod` desde `/apps/web`
- [ ] Configurar variable: `VITE_API_URL=https://tuapi.railway.app`
- [ ] Verificar que carga correctamente
- [ ] Configurar CORS en backend para aceptar requests

#### MercadoPago Webhook
- [ ] Configurar URL en panel MP: `https://tuapi.railway.app/mercadopago/webhook`
- [ ] Verificar que recibe notificaciones de test

**Estimación:** 6 horas (puede haber sorpresas)  
**Bloqueante:** SÍ - Sin URL pública, no hay webhook, no hay activación de pagos

---

## ⚠️ PRIORIDAD ALTA (Importantes pero no bloquean deploy)

### ⚠️ 5. LEGAL MÍNIMO (2 horas)
**Riesgo legal bajo, pero debe existir.**

- [ ] Copiar template T&C de [termsfeed.com](https://termsfeed.com)
- [ ] Copiar template Privacy Policy (GDPR básico)
- [ ] Crear `/apps/web/src/pages/legal/Terms.tsx`
- [ ] Crear `/apps/web/src/pages/legal/Privacy.tsx`
- [ ] Agregar links en footer: "Términos" | "Privacidad"
- [ ] Agregar checkbox en registro: "Acepto términos y condiciones"

**Estimación:** 2 horas  
**Bloqueante:** NO, pero debe estar antes de marketing activo

---

### ⚠️ 6. ONBOARDING CLARO (2 horas)
**Usuario paga y no sabe qué hacer = churn inmediato.**

- [ ] Agregar tooltip en dashboard: "¿Qué hace cada scanner?"
- [ ] Texto explicativo de 2 párrafos arriba de "Agregar dominio"
- [ ] Toast después de pago exitoso: "¡Bienvenido! Ahora podés escanear sin límites"
- [ ] Email manual de bienvenida (primeros 10 usuarios)

**Estimación:** 2 horas  
**Bloqueante:** NO, pero mejora retención

---

### ⚠️ 7. TESTING E2E EN PRODUCCIÓN (3 horas)
**Validar que el flujo completo funciona en prod.**

Flujo a testear:
1. [ ] Registro nuevo usuario
2. [ ] Agregar dominio
3. [ ] Hacer 1 escaneo (debe funcionar - plan TRIAL inicial)
4. [ ] Intentar escaneo #6 → debe mostrar modal de upgrade
5. [ ] Click "Upgrade" → checkout MercadoPago
6. [ ] Pagar con tarjeta test
7. [ ] Verificar webhook recibido en logs Railway
8. [ ] Verificar plan activado en base de datos
9. [ ] Hacer escaneo #6 → debe funcionar
10. [ ] Verificar resultado en dashboard

**Estimación:** 3 horas  
**Bloqueante:** NO, pero es crítico antes de invitar usuarios reales

---

## ✅ OPCIONAL POST-MVP (NO implementar ahora)

### 🚫 8. COSAS QUE NO VAN EN v1
**Scope creep = muerte del MVP**

- ❌ Multi-idioma (español alcanza)
- ❌ Stripe (ya elegiste MercadoPago para LATAM)
- ❌ Notificaciones push (email basta)
- ❌ Dashboard de admin (usar Prisma Studio)
- ❌ Analytics custom (Google Analytics free alcanza)
- ❌ Tests unitarios nuevos (E2E alcanza)
- ❌ Documentación de API (no hay devs externos)
- ❌ Optimizaciones de performance (no hay carga)
- ❌ Integración Slack/Teams (prometido en GROWTH/PRO, pero post-MVP)
- ❌ Reportes PDF/CSV (prometido en planes, pero post-MVP)
- ❌ Trends históricos (prometido en PRO, pero post-MVP)

**REGLA:** Si no desbloquea monetización o deployment, NO VA EN v1.

---

## 📊 RESUMEN EJECUTIVO

| Tarea | Tiempo | Bloqueante | Orden |
|-------|--------|-----------|-------|
| **1. Checkout frontend completo** | 6h | ✅ SÍ | 1° |
| **2. Plan enforcement (guards + modal)** | 4h | ✅ SÍ | 2° |
| **3. Conectar CTAs → checkout** | 2h | ✅ SÍ | 3° |
| **4. Deploy Railway + Vercel** | 6h | ✅ SÍ | 4° |
| **5. Legal mínimo (T&C + Privacy)** | 2h | ⚠️ Medio | 5° |
| **6. Onboarding claro** | 2h | ⚠️ Medio | 6° |
| **7. Testing E2E producción** | 3h | ⚠️ Medio | 7° |

### ⏱️ **Total bloqueantes críticos:** 18 horas
### ⏱️ **Total completo:** 25 horas

**Traducido a tiempo real:**
- **Modo sprint:** 2-3 días full-time
- **Modo normal:** 1 semana part-time

---

## 🎯 PLAN DE EJECUCIÓN SUGERIDO

### **DÍA 1: Monetización (8h)**
1. ✅ Plan enforcement backend (2h)
2. ✅ Upgrade modal frontend (2h)
3. ✅ Checkout page completo (4h)

**Al final del día:** Flujo de conversión funciona localmente

---

### **DÍA 2: Deployment (8h)**
1. ✅ Conectar CTAs landing → checkout (1h)
2. ✅ Deploy Railway backend (3h)
3. ✅ Deploy Vercel frontend (1h)
4. ✅ Testing básico pago sandbox (2h)
5. ✅ Legal templates (1h)

**Al final del día:** MVP online, URL pública funcionando

---

### **DÍA 3: Validación (4-6h)**
1. ✅ Testing E2E completo en prod (3h)
2. ✅ Onboarding mejorado (2h)
3. ✅ Preparar credenciales MercadoPago prod
4. ✅ Documentar flujo para beta testers

**Al final del día:** Listo para invitar primeros 5-10 usuarios

---

## 🚨 RIESGOS IDENTIFICADOS

### Técnicos:
1. **Webhook MercadoPago puede tardar en propagar** (30-60 segundos)
   - Solución: Mostrar "Procesando pago..." mientras
   
2. **Tipo de cambio USD/ARS hardcodeado** (1480)
   - Solución v1: Actualizar manual 1 vez por semana
   
3. **CORS en Railway puede bloquear Vercel**
   - Solución: Agregar dominio Vercel a whitelist

### Negocio:
1. **¿Tenés credenciales REALES de MercadoPago?**
   - Si NO → Crear cuenta HOY (demora 1-2 días verificación)
   
2. **Usuario paga y no recibe confirmación**
   - Solución: Email manual primeros 10 usuarios
   
3. **Onboarding confuso = churn**
   - Solución: 2 párrafos claros + tooltips

---

## ✅ CRITERIOS DE ÉXITO MVP

**Podés lanzar cuando:**
- ✅ Usuario puede registrarse
- ✅ Usuario puede hacer 1 escaneo gratis (TRIAL)
- ✅ Al llegar a límite, aparece modal de upgrade
- ✅ Usuario puede pagar con MercadoPago
- ✅ Webhook activa plan automáticamente
- ✅ Usuario con plan pago puede escanear sin límites
- ✅ Todo funciona en URL pública (no localhost)
- ✅ Existen T&C y Privacy Policy (aunque sean templates)

**NO necesitás:**
- ❌ 100% de cobertura de tests
- ❌ Documentación exhaustiva
- ❌ Performance optimizada (no hay carga)
- ❌ Features avanzados prometidos en planes premium

---

## 💬 PREGUNTA CRÍTICA

**¿Tenés credenciales de producción de MercadoPago?**
- **SÍ** → Arrancamos ahora con punto 1 (Checkout frontend)
- **NO** → Creá cuenta HOY mientras yo avanzo con guards y modal

**¿Arrancamos con enforcement de límites + upgrade modal?**  
Es lo más rápido para probar conversión localmente (4 horas).

---

## 📝 NOTAS FINALES

### Lo que YA FUNCIONA (no tocar):
- ✅ Backend NestJS sólido
- ✅ 4 scanners operativos
- ✅ Sistema de colas Redis/Bull
- ✅ MercadoPago service completo
- ✅ Frontend con Material-UI
- ✅ Autenticación JWT
- ✅ Base de datos bien diseñada

### Lo que FALTA para ser vendible:
- ❌ Usuario no puede pagar
- ❌ No hay enforcement de límites
- ❌ Botones no llevan a checkout
- ❌ No está deployado

**Conclusión:** Tenés el 80% del código, pero 0% del producto vendible.  
**Acción:** Enfocarse en monetización y deployment, NO en nuevas features.
