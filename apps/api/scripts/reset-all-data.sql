-- Script para resetear TODOS los datos y empezar de cero
-- CUIDADO: Esto elimina usuarios, empresas, scans, todo excepto los plan limits

-- 1. Eliminar todos los findings
DELETE FROM security_findings;

-- 2. Eliminar todos los scans
DELETE FROM security_scans;

-- 3. Eliminar todos los assets
DELETE FROM assets;

-- 4. Eliminar todas las empresas
DELETE FROM companies;

-- 5. Eliminar todas las suscripciones
DELETE FROM subscriptions;

-- 6. Eliminar todos los usuarios
DELETE FROM users;

-- 7. Resetear secuencias (si las hay)
-- PostgreSQL maneja esto automáticamente

-- Verificar que quedaron solo los plan limits
SELECT 'Plan Limits restantes:' as mensaje, COUNT(*) as cantidad FROM plan_limits;
SELECT 'Usuarios restantes:' as mensaje, COUNT(*) as cantidad FROM users;
SELECT 'Empresas restantes:' as mensaje, COUNT(*) as cantidad FROM companies;
SELECT 'Scans restantes:' as mensaje, COUNT(*) as cantidad FROM security_scans;
