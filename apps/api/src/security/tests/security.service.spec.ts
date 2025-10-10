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

  // Nota: Los tests de calculateHealthScore se movieron a shared/utils.spec.ts
  // ya que esa función ahora está en el paquete compartido
});
