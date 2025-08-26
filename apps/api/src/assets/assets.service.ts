import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CompaniesService } from '../companies/companies.service';
import { CreateAssetInput } from '../graphql/inputs';
import { Asset } from '../graphql/models';

@Injectable()
export class AssetsService {
  constructor(
    private prisma: PrismaService,
    private companiesService: CompaniesService,
  ) {}

  /**
   * Crear un nuevo asset/dominio
   */
  async createAsset(userId: string, input: CreateAssetInput): Promise<Asset> {
    // Verificar que la empresa existe y pertenece al usuario
    const company = await this.companiesService.getCompanyById(userId, input.companyId);
    
    // Validar formato del dominio
    if (!this.isValidDomain(input.domain)) {
      throw new BadRequestException('Formato de dominio inválido');
    }

    // Verificar que el dominio no esté ya registrado en esta empresa
    const existingAsset = await this.prisma.asset.findFirst({
      where: {
        domain: input.domain,
        companyId: input.companyId,
        isActive: true,
      },
    });

    if (existingAsset) {
      throw new BadRequestException(`El dominio ${input.domain} ya está registrado en esta empresa`);
    }

    // Crear el asset
    const asset = await this.prisma.asset.create({
      data: {
        domain: input.domain,
        companyId: input.companyId,
        isActive: input.isActive ?? true,
      },
      include: {
        company: true,
      },
    });

    return asset as Asset;
  }

  /**
   * Obtener todos los assets de una empresa
   */
  async getCompanyAssets(userId: string, companyId: string): Promise<Asset[]> {
    // Verificar que la empresa existe y pertenece al usuario
    await this.companiesService.getCompanyById(userId, companyId);

    const assets = await this.prisma.asset.findMany({
      where: {
        companyId,
        isActive: true,
      },
      include: {
        company: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return assets as Asset[];
  }

  /**
   * Obtener un asset específico
   */
  async getAssetById(userId: string, assetId: string): Promise<Asset> {
    const asset = await this.prisma.asset.findUnique({
      where: { id: assetId },
      include: {
        company: true,
      },
    });

    if (!asset) {
      throw new NotFoundException('Asset no encontrado');
    }

    // Verificar que el usuario tiene acceso a la empresa del asset
    await this.companiesService.getCompanyById(userId, asset.companyId);

    return asset as Asset;
  }

  /**
   * Actualizar un asset
   */
  async updateAsset(userId: string, assetId: string, updates: { isActive?: boolean }): Promise<Asset> {
    const asset = await this.getAssetById(userId, assetId);

    const updatedAsset = await this.prisma.asset.update({
      where: { id: assetId },
      data: updates,
      include: {
        company: true,
      },
    });

    return updatedAsset as Asset;
  }

  /**
   * Desactivar un asset (soft delete)
   */
  async deactivateAsset(userId: string, assetId: string): Promise<boolean> {
    await this.updateAsset(userId, assetId, { isActive: false });
    return true;
  }

  /**
   * Eliminar un asset (hard delete)
   */
  async deleteAsset(userId: string, assetId: string): Promise<boolean> {
    const asset = await this.getAssetById(userId, assetId);

    await this.prisma.asset.delete({
      where: { id: assetId },
    });

    return true;
  }

  /**
   * Validar formato de dominio
   */
  private isValidDomain(domain: string): boolean {
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]\.([a-zA-Z]{2,}|xn--[a-zA-Z0-9]+)$/;
    
    // Permitir subdominios también
    const subdomainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]\.([a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]\.)+([a-zA-Z]{2,}|xn--[a-zA-Z0-9]+)$/;
    
    return domainRegex.test(domain) || subdomainRegex.test(domain);
  }

  /**
   * Obtener todos los assets del usuario (para dashboard general)
   */
  async getUserAssets(userId: string): Promise<Asset[]> {
    const companies = await this.companiesService.getUserCompanies(userId);
    const companyIds = companies.map(c => c.id);

    const assets = await this.prisma.asset.findMany({
      where: {
        companyId: { in: companyIds },
        isActive: true,
      },
      include: {
        company: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return assets as Asset[];
  }

  /**
   * Verificar si el usuario puede agregar más assets
   * Basado en su plan de suscripción
   */
  async canCreateAsset(userId: string, companyId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: true,
      },
    });

    if (!user || !user.subscription) {
      return false;
    }

    // Contar assets actuales del usuario
    const totalAssets = await this.prisma.asset.count({
      where: {
        company: { userId },
        isActive: true,
      },
    });

    // Límites por plan
    const limits = {
      TRIAL: 3,         // 3 dominios en trial
      STARTER: 10,      // 10 dominios en starter  
      PROFESSIONAL: 50, // 50 dominios en professional
    };

    const maxAssets = limits[user.subscription.plan] || 0;

    return totalAssets < maxAssets;
  }
}
