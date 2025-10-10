import { PrismaClient, SubscriptionPlan } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Limpiar datos existentes de límites de planes
  await prisma.planLimits.deleteMany();

  // Crear límites por plan según tu modelo de negocio CLARIFICADO
  const planLimits = [
    {
      plan: SubscriptionPlan.TRIAL,
      // Campos antiguos (por compatibilidad)
      maxDomains: 1,
      maxAssets: 5,
      // Campos nuevos (lógica clarificada)
      maxCompanies: 1,          // 1 empresa para probar
      maxAssetsPerCompany: 5,   // 5 recursos por empresa (limitado para trial)
      scanFrequencyHours: 168,  // semanal
      hasSlackIntegration: false,
      hasTeamsIntegration: false,
      hasPDFReports: true,
      hasCSVReports: false,
      hasComplianceReports: false,
      hasAuditorAccess: false,
      hasPrioritySupport: false,
      hasHistoricalTrends: false,
      maxUsers: 1,
      priceUsd: 0, // gratis por 14 días
    },
    {
      plan: SubscriptionPlan.STARTER,
      // Campos antiguos (por compatibilidad)  
      maxDomains: 1,
      maxAssets: 10,
      // Campos nuevos (lógica clarificada)
      maxCompanies: 1,          // 1 empresa/negocio
      maxAssetsPerCompany: 10,  // 10 recursos (web, tienda, blog, etc.)
      scanFrequencyHours: 168,  // semanal
      hasSlackIntegration: false,
      hasTeamsIntegration: false,
      hasPDFReports: true,
      hasCSVReports: false,
      hasComplianceReports: false,
      hasAuditorAccess: false,
      hasPrioritySupport: false,
      hasHistoricalTrends: false,
      maxUsers: 1,
      priceUsd: 2900, // USD 29.00
    },
    {
      plan: SubscriptionPlan.GROWTH,
      // Campos antiguos (por compatibilidad)
      maxDomains: 3,
      maxAssets: 45, // 3 empresas x 15 recursos cada una
      // Campos nuevos (lógica clarificada)
      maxCompanies: 3,          // 3 empresas/negocios diferentes
      maxAssetsPerCompany: 15,  // 15 recursos por cada empresa
      scanFrequencyHours: 24,   // diario
      hasSlackIntegration: true,
      hasTeamsIntegration: true,
      hasPDFReports: true,
      hasCSVReports: true,
      hasComplianceReports: false,
      hasAuditorAccess: false,
      hasPrioritySupport: true,
      hasHistoricalTrends: true,
      maxUsers: 3, // hasta 3 usuarios colaboradores
      priceUsd: 6900, // USD 69.00
    },
    {
      plan: SubscriptionPlan.PRO,
      // Campos antiguos (por compatibilidad)
      maxDomains: -1,
      maxAssets: -1,
      // Campos nuevos (lógica clarificada)
      maxCompanies: -1,         // empresas ilimitadas
      maxAssetsPerCompany: -1,  // recursos ilimitados por empresa
      scanFrequencyHours: 6,    // cada 6 horas (tiempo casi real)
      hasSlackIntegration: true,
      hasTeamsIntegration: true,
      hasPDFReports: true,
      hasCSVReports: true,
      hasComplianceReports: true,
      hasAuditorAccess: true,
      hasPrioritySupport: true,
      hasHistoricalTrends: true,
      maxUsers: -1, // usuarios ilimitados
      priceUsd: 14900, // USD 149.00
    },
  ];

  for (const limits of planLimits) {
    await prisma.planLimits.create({
      data: limits,
    });
    console.log(`✅ Created limits for ${limits.plan} plan`);
  }

  // Create test user
  const testUser = await prisma.user.upsert({
    where: { email: 'test@dalone.com.ar' },
    update: {},
    create: {
      email: 'test@dalone.com.ar',
      firstName: 'Usuario',
      lastName: 'Prueba',
      password: '$2b$10$rXKh5gp7gqIQxNKZnOPEJ.Nm2vvSJbQHd0WP9V4fI.mDECo7vbMzO', // "password123"
      companies: {
        create: {
          name: 'Dalone Corporation',
          domain: 'dalone.com.ar',
          assets: {
            create: [
              {
                domain: 'dalone.com.ar',
              }
            ]
          }
        }
      }
    },
  });
  console.log(`✅ Created test user: ${testUser.email}`);

  // Get the created company to add security scans
  const testCompany = await prisma.company.findFirst({
    where: { userId: testUser.id }
  });

  if (testCompany) {
    // Create security scans with findings
    const scan1 = await prisma.securityScan.create({
      data: {
        companyId: testCompany.id,
        domain: 'dalone.com.ar',
        status: 'COMPLETED',
        healthScore: 75,
        findings: {
          create: [
            {
              category: 'SSL_CERTIFICATE',
              severity: 'HIGH',
              title: 'SSL Certificate Expired',
              description: 'The SSL certificate for dalone.com.ar has expired and needs immediate renewal.',
              recommendation: 'Renew the SSL certificate immediately to ensure secure connections.',
              status: 'OPEN'
            },
            {
              category: 'WEB_SECURITY',
              severity: 'MEDIUM',
              title: 'Missing Security Headers',
              description: 'X-Frame-Options header is missing, potentially enabling clickjacking attacks.',
              recommendation: 'Add X-Frame-Options: DENY header to prevent iframe embedding.',
              status: 'OPEN'
            },
            {
              category: 'NETWORK_SECURITY',
              severity: 'LOW',
              title: 'Open Port Detected',
              description: 'Web service detected on non-standard port 8080.',
              recommendation: 'Verify that the service on port 8080 is intended for public access and properly secured.',
              status: 'RESOLVED'
            }
          ]
        }
      }
    });

    const scan2 = await prisma.securityScan.create({
      data: {
        companyId: testCompany.id,
        domain: 'laburen.com',
        status: 'COMPLETED',
        healthScore: 60,
        findings: {
          create: [
            {
              category: 'SSL_CERTIFICATE',
              severity: 'CRITICAL',
              title: 'Weak SSL/TLS Configuration',
              description: 'Weak SSL/TLS configuration detected with outdated cipher suites.',
              recommendation: 'Update SSL/TLS configuration to use modern, secure cipher suites.',
              status: 'OPEN'
            },
            {
              category: 'EMAIL_SECURITY',
              severity: 'HIGH',
              title: 'Missing DMARC Record',
              description: 'DMARC lookup failed: queryTxt ENOTFOUND _dmarc.laburen.com',
              recommendation: 'Configure a DMARC policy starting with "p=none" to monitor email authentication.',
              status: 'IN_PROGRESS'
            },
            {
              category: 'WEB_SECURITY',
              severity: 'MEDIUM',
              title: 'Content-Security-Policy Missing',
              description: 'Content Security Policy header is missing, leaving the site vulnerable to XSS attacks.',
              recommendation: 'Implement a CSP header starting with "default-src \'self\'" and gradually refine it.',
              status: 'OPEN'
            },
            {
              category: 'NETWORK_SECURITY',
              severity: 'LOW',
              title: 'Web Service on Non-Standard Port 3000',
              description: 'Web service detected on non-standard port 3000. This might be intentional but could indicate a development interface.',
              recommendation: 'Verify that the service on port 3000 is intended for public access and properly secured.',
              status: 'RESOLVED'
            }
          ]
        }
      }
    });

    console.log(`✅ Created security scans with findings for ${testCompany.name}`);
  }

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
