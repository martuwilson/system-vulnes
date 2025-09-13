-- Script para limpiar datos de scans mezclados y empezar de cero con dominios separados

-- 1. Eliminar todos los findings existentes (por la relación FK)
DELETE FROM "findings";

-- 2. Eliminar todos los scans existentes
DELETE FROM "security_scans";

-- 3. Reiniciar los contadores de secuencia si existen
-- (PostgreSQL guarda los IDs automáticos, esto los resetea)

-- Mensaje de confirmación
SELECT 'Datos de scans eliminados correctamente. Ahora cada dominio tendrá scans limpios.' as mensaje;
