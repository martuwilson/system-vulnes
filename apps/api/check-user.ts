import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function checkUser() {
  const user = await prisma.user.findUnique({
    where: { email: 'williner.martin@gmail.com' },
  });

  if (!user) {
    console.log('❌ Usuario no encontrado');
    return;
  }

  console.log('✅ Usuario encontrado:');
  console.log('ID:', user.id);
  console.log('Email:', user.email);
  console.log('Nombre:', user.firstName, user.lastName);
  console.log('Password Hash:', user.password);
  console.log('');

  // Probar diferentes contraseñas
  const passwords = ['Pass1234!', 'pass1234!', 'Pass1234', 'password'];
  
  for (const pwd of passwords) {
    const isValid = await bcrypt.compare(pwd, user.password);
    console.log(`Probando "${pwd}": ${isValid ? '✅ VÁLIDA' : '❌ INVÁLIDA'}`);
  }

  await prisma.$disconnect();
}

checkUser().catch(console.error);
