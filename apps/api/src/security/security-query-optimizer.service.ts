import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SecurityQueryOptimizer {
  constructor(private prisma: PrismaService) {}

  // Optimizar query de findings con relaciones
  async getOptimizedFindings(companyId: string, filters?: any) {
    return this.prisma.finding.findMany({
      where: {
        scan: {
          companyId,
        },
        ...filters,
      },
      select: {
        id: true,
        title: true,
        severity: true,
        status: true,
        category: true,
        description: true,
        recommendation: true,
        createdAt: true,
        scan: {
          select: {
            id: true,
            domain: true,
            createdAt: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Batch loading para estadísticas
  async getSecurityMetricsBatch(companyIds: string[]) {
    const scans = await this.prisma.securityScan.findMany({
      where: {
        companyId: {
          in: companyIds,
        },
        status: 'COMPLETED',
      },
      select: {
        id: true,
        companyId: true,
        healthScore: true,
        createdAt: true,
        findings: {
          select: {
            severity: true,
            status: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Agrupar por companyId
    return scans.reduce((acc, scan) => {
      if (!acc[scan.companyId]) {
        acc[scan.companyId] = [];
      }
      acc[scan.companyId].push(scan);
      return acc;
    }, {} as Record<string, typeof scans>);
  }

  // Cache para queries frecuentes
  private cache = new Map<string, { data: any; timestamp: number }>();
  private CACHE_TTL = 5 * 60 * 1000; // 5 minutos

  async getCachedData<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    const cached = this.cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }

    const data = await fetcher();
    this.cache.set(key, { data, timestamp: Date.now() });
    
    return data;
  }

  clearCache(pattern?: string) {
    if (pattern) {
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
  }
}
