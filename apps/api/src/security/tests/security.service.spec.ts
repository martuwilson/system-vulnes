import { Test, TestingModule } from '@nestjs/testing';
import { SecurityService } from '../security.service';
import { PrismaService } from '../../prisma/prisma.service';
import { SecurityLogger } from '../../common/security-logger.service';

describe('SecurityService', () => {
  let service: SecurityService;
  let prismaService: PrismaService;
  let logger: SecurityLogger;

  const mockPrismaService = {
    securityScan: {
      create: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    finding: {
      createMany: jest.fn(),
      count: jest.fn(),
    },
    company: {
      findUnique: jest.fn(),
    },
  };

  const mockLogger = {
    logScanStart: jest.fn(),
    logScanComplete: jest.fn(),
    logScanError: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SecurityService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: SecurityLogger, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<SecurityService>(SecurityService);
    prismaService = module.get<PrismaService>(PrismaService);
    logger = module.get<SecurityLogger>(SecurityLogger);
  });

  describe('startAssetScan', () => {
    it('should create a new scan and return results', async () => {
      // Arrange
      const mockAsset = {
        id: 'asset-1',
        domain: 'example.com',
        companyId: 'company-1',
      };

      const mockScan = {
        id: 'scan-1',
        companyId: 'company-1',
        domain: 'example.com',
        status: 'RUNNING',
        healthScore: 0,
      };

      mockPrismaService.securityScan.create.mockResolvedValue(mockScan);

      // Act
      const result = await service.startAssetScan('asset-1', 'company-1');

      // Assert
      expect(mockPrismaService.securityScan.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          companyId: 'company-1',
          domain: 'example.com',
          status: 'RUNNING',
          healthScore: 0,
        }),
      });

      expect(logger.logScanStart).toHaveBeenCalled();
      expect(result).toEqual(expect.objectContaining({
        scanId: 'scan-1',
      }));
    });

    it('should handle scan failures gracefully', async () => {
      // Arrange
      mockPrismaService.securityScan.create.mockRejectedValue(
        new Error('Database error')
      );

      // Act & Assert
      await expect(
        service.startAssetScan('asset-1', 'company-1')
      ).rejects.toThrow('Database error');

      expect(logger.logScanError).toHaveBeenCalled();
    });
  });

  describe('calculateHealthScore', () => {
    it('should calculate correct health score for findings', () => {
      // Arrange
      const findings = [
        { severity: 'CRITICAL' },
        { severity: 'HIGH' },
        { severity: 'MEDIUM' },
        { severity: 'LOW' },
      ];

      // Act
      const score = service.calculateHealthScore(findings as any);

      // Assert
      // 100 - 25 (critical) - 15 (high) - 8 (medium) - 3 (low) = 49
      expect(score).toBe(49);
    });

    it('should return 100 for no findings', () => {
      const score = service.calculateHealthScore([]);
      expect(score).toBe(100);
    });

    it('should not return negative scores', () => {
      const manyFindings = Array(10).fill({ severity: 'CRITICAL' });
      const score = service.calculateHealthScore(manyFindings as any);
      expect(score).toBe(0);
    });
  });
});
