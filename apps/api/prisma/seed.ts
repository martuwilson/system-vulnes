import { PrismaClient, SubscriptionPlan } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Limpiar datos existentes de límites de planes
  await prisma.planLimits.deleteMany();

  // Crear límites por plan según tu modelo de negocio
  const planLimits = [
    {
      plan: SubscriptionPlan.TRIAL,
      maxDomains: 1,
      maxAssets: 10,
      scanFrequencyHours: 168, // semanal
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
      maxDomains: 1,
      maxAssets: 10,
      scanFrequencyHours: 168, // semanal
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
      maxDomains: 5,
      maxAssets: 50,
      scanFrequencyHours: 24, // diario
      hasSlackIntegration: true,
      hasTeamsIntegration: true,
      hasPDFReports: true,
      hasCSVReports: true,
      hasComplianceReports: false,
      hasAuditorAccess: false,
      hasPrioritySupport: false,
      hasHistoricalTrends: true,
      maxUsers: -1, // unlimited
      priceUsd: 9900, // USD 99.00
    },
    {
      plan: SubscriptionPlan.PRO,
      maxDomains: -1, // unlimited
      maxAssets: -1, // unlimited
      scanFrequencyHours: 6, // cada 6 horas (tiempo casi real)
      hasSlackIntegration: true,
      hasTeamsIntegration: true,
      hasPDFReports: true,
      hasCSVReports: true,
      hasComplianceReports: true,
      hasAuditorAccess: true,
      hasPrioritySupport: true,
      hasHistoricalTrends: true,
      maxUsers: -1, // unlimited
      priceUsd: 24900, // USD 249.00
    },
  ];

  for (const limits of planLimits) {
    await prisma.planLimits.create({
      data: limits,
    });
    console.log(`✅ Created limits for ${limits.plan} plan`);
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
