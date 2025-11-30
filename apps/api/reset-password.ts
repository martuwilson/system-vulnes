import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function resetPassword() {
  const newPassword = 'Pass1234!';
  const hashedPassword = await bcrypt.hash(newPassword, 12);

  const user = await prisma.user.update({
    where: { email: 'williner.martin@gmail.com' },
    data: { password: hashedPassword },
  });

  console.log('✅ Contraseña actualizada para:', user.email);
  console.log('🔑 Nueva contraseña:', newPassword);
  console.log('🔐 Hash guardado:', hashedPassword);
  
  // Verificar que funciona
  const isValid = await bcrypt.compare(newPassword, hashedPassword);
  console.log('✅ Verificación:', isValid ? 'FUNCIONA' : 'ERROR');

  await prisma.$disconnect();
}

resetPassword().catch(console.error);
