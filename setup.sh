#!/bin/bash

echo "🚀 Configurando el proyecto Security System PYME..."

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instala Node.js >= 18"
    exit 1
fi

# Verificar npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm no está instalado. Por favor instala npm >= 9"
    exit 1
fi

# Verificar Docker (opcional)
if ! command -v docker &> /dev/null; then
    echo "⚠️  Docker no está instalado. Será necesario para ejecutar la base de datos."
    echo "Puedes instalar Docker más tarde o usar una instancia externa de PostgreSQL y Redis."
fi

echo "📦 Instalando dependencias..."
npm install

echo "🔧 Configurando variables de entorno..."

# API
if [ ! -f "apps/api/.env" ]; then
    cp apps/api/.env.example apps/api/.env
    echo "✅ Creado apps/api/.env desde el ejemplo"
fi

# Web
if [ ! -f "apps/web/.env" ]; then
    cp apps/web/.env.example apps/web/.env
    echo "✅ Creado apps/web/.env desde el ejemplo"
fi

# Workers
if [ ! -f "apps/workers/.env" ]; then
    cp apps/workers/.env.example apps/workers/.env
    echo "✅ Creado apps/workers/.env desde el ejemplo"
fi

echo "🏗️  Construyendo paquete compartido..."
cd packages/shared && npm run build && cd ../..

echo "🗄️  Generando cliente Prisma..."
cd apps/api && npm run db:generate && cd ../..

echo ""
echo "✅ ¡Configuración completada!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Asegúrate de tener PostgreSQL y Redis ejecutándose"
echo "   - Con Docker: docker-compose up -d postgres redis"
echo "   - O configura tus propias instancias"
echo ""
echo "2. Ejecuta las migraciones de base de datos:"
echo "   npm run db:push"
echo ""
echo "3. Inicia el proyecto en modo desarrollo:"
echo "   npm run dev"
echo ""
echo "4. Abre tu navegador en:"
echo "   - Frontend: http://localhost:3000"
echo "   - API GraphQL: http://localhost:3001/graphql"
echo ""
echo "🎉 ¡Listo para desarrollar!"
