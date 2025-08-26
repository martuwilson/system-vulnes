import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyInput, UpdateCompanyInput } from '../graphql/inputs';
import { Company } from '../graphql/models';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Crear una nueva empresa
   * Solo el usuario autenticado puede crear empresas para sí mismo
   */
  async createCompany(userId: string, input: CreateCompanyInput): Promise<Company> {
    // Verificar que el dominio no esté ya registrado por otro usuario
    const existingCompany = await this.prisma.company.findFirst({
      where: { domain: input.domain },
    });

    if (existingCompany && existingCompany.userId !== userId) {
      throw new ForbiddenException(`El dominio ${input.domain} ya está registrado por otro usuario`);
    }

    if (existingCompany && existingCompany.userId === userId) {
      throw new ForbiddenException(`Ya tienes una empresa registrada con el dominio ${input.domain}`);
    }

    // Crear la empresa
    const company = await this.prisma.company.create({
      data: {
        name: input.name,
        domain: input.domain,
        userId: userId,
      },
    });

    return company as Company;
  }

  /**
   * Obtener todas las empresas del usuario
   */
  async getUserCompanies(userId: string): Promise<Company[]> {
    const companies = await this.prisma.company.findMany({
      where: { userId },
      include: {
        assets: {
          where: { isActive: true },
        },
        _count: {
          select: {
            assets: true,
            scans: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return companies as Company[];
  }

  /**
   * Obtener una empresa específica del usuario
   */
  async getCompanyById(userId: string, companyId: string): Promise<Company> {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
      include: {
        assets: {
          where: { isActive: true },
          orderBy: { createdAt: 'desc' },
        },
        scans: {
          orderBy: { createdAt: 'desc' },
          take: 5, // Últimos 5 scans
        },
        _count: {
          select: {
            assets: true,
            scans: true,
          },
        },
      },
    });

    if (!company) {
      throw new NotFoundException('Empresa no encontrada');
    }

    if (company.userId !== userId) {
      throw new ForbiddenException('No tienes acceso a esta empresa');
    }

    return company as Company;
  }

  /**
   * Actualizar una empresa
   */
  async updateCompany(userId: string, companyId: string, input: UpdateCompanyInput): Promise<Company> {
    // Verificar que la empresa existe y pertenece al usuario
    const existingCompany = await this.prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!existingCompany) {
      throw new NotFoundException('Empresa no encontrada');
    }

    if (existingCompany.userId !== userId) {
      throw new ForbiddenException('No tienes acceso a esta empresa');
    }

    // Si se está actualizando el dominio, verificar que no esté en uso
    if (input.domain && input.domain !== existingCompany.domain) {
      const domainInUse = await this.prisma.company.findFirst({
        where: { domain: input.domain },
      });

      if (domainInUse && domainInUse.id !== companyId) {
        throw new ForbiddenException(`El dominio ${input.domain} ya está en uso`);
      }
    }

    // Actualizar la empresa
    const company = await this.prisma.company.update({
      where: { id: companyId },
      data: {
        ...(input.name && { name: input.name }),
        ...(input.domain && { domain: input.domain }),
      },
      include: {
        assets: {
          where: { isActive: true },
        },
        _count: {
          select: {
            assets: true,
            scans: true,
          },
        },
      },
    });

    return company as Company;
  }

  /**
   * Eliminar una empresa (soft delete)
   * En el futuro podríamos agregar un campo 'isActive' o 'deletedAt'
   */
  async deleteCompany(userId: string, companyId: string): Promise<boolean> {
    // Verificar que la empresa existe y pertenece al usuario
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundException('Empresa no encontrada');
    }

    if (company.userId !== userId) {
      throw new ForbiddenException('No tienes acceso a esta empresa');
    }

    // Por ahora hacemos hard delete, pero en producción sería mejor soft delete
    await this.prisma.company.delete({
      where: { id: companyId },
    });

    return true;
  }

  /**
   * Validar si el usuario puede crear más empresas
   * Basado en su plan de suscripción
   */
  async canCreateCompany(userId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: true,
        companies: true,
      },
    });

    if (!user || !user.subscription) {
      return false;
    }

    // Límites por plan
    const limits = {
      TRIAL: 1,      // Solo 1 empresa en trial
      STARTER: 3,    // Hasta 3 empresas en starter
      PROFESSIONAL: 10, // Hasta 10 empresas en professional
    };

    const currentCompanies = user.companies.length;
    const maxCompanies = limits[user.subscription.plan] || 0;

    return currentCompanies < maxCompanies;
  }
}
