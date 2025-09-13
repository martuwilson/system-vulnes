import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanScanData() {
  try {
    console.log('🧹 Limpiando datos de scans mezclados...');
    
    // 1. Eliminar todos los findings (por la FK constraint)
    const deletedFindings = await prisma.finding.deleteMany({});
    console.log(`✅ Eliminados ${deletedFindings.count} findings`);
    
    // 2. Eliminar todos los scans
    const deletedScans = await prisma.securityScan.deleteMany({});
    console.log(`✅ Eliminados ${deletedScans.count} scans`);
    
    console.log('🎉 Datos de scans limpiados correctamente!');
    console.log('💡 Ahora cada dominio tendrá scans completamente separados');
    
  } catch (error) {
    console.error('❌ Error al limpiar datos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanScanData();
