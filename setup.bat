@echo off

echo 🚀 Configurando el proyecto Security System PYME...

:: Verificar Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js no está instalado. Por favor instala Node.js >= 18
    exit /b 1
)

:: Verificar npm
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm no está instalado. Por favor instala npm >= 9
    exit /b 1
)

:: Verificar Docker (opcional)
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  Docker no está instalado. Será necesario para ejecutar la base de datos.
    echo Puedes instalar Docker más tarde o usar una instancia externa de PostgreSQL y Redis.
)

echo 📦 Instalando dependencias...
call npm install

echo 🔧 Configurando variables de entorno...

:: API
if not exist "apps\api\.env" (
    copy "apps\api\.env.example" "apps\api\.env"
    echo ✅ Creado apps\api\.env desde el ejemplo
)

:: Web
if not exist "apps\web\.env" (
    copy "apps\web\.env.example" "apps\web\.env"
    echo ✅ Creado apps\web\.env desde el ejemplo
)

:: Workers
if not exist "apps\workers\.env" (
    copy "apps\workers\.env.example" "apps\workers\.env"
    echo ✅ Creado apps\workers\.env desde el ejemplo
)

echo 🏗️  Construyendo paquete compartido...
cd packages\shared
call npm run build
cd ..\..

echo 🗄️  Generando cliente Prisma...
cd apps\api
call npm run db:generate
cd ..\..

echo.
echo ✅ ¡Configuración completada!
echo.
echo 📋 Próximos pasos:
echo 1. Asegúrate de tener PostgreSQL y Redis ejecutándose
echo    - Con Docker: docker-compose up -d postgres redis
echo    - O configura tus propias instancias
echo.
echo 2. Ejecuta las migraciones de base de datos:
echo    npm run db:push
echo.
echo 3. Inicia el proyecto en modo desarrollo:
echo    npm run dev
echo.
echo 4. Abre tu navegador en:
echo    - Frontend: http://localhost:3000
echo    - API GraphQL: http://localhost:3001/graphql
echo.
echo 🎉 ¡Listo para desarrollar!

pause
