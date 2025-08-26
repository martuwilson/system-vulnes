import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyInput, UpdateCompanyInput } from '../graphql/inputs';
import { Company } from '../graphql/models';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Resolver(() => Company)
export class CompaniesResolver {
  constructor(private companiesService: CompaniesService) {}

  /**
   * Crear una nueva empresa
   * Requiere autenticación
   */
  @Mutation(() => Company)
  @UseGuards(JwtAuthGuard)
  async createCompany(
    @Args('input') input: CreateCompanyInput,
    @CurrentUser() user: any,
  ): Promise<Company> {
    // Verificar si el usuario puede crear más empresas
    const canCreate = await this.companiesService.canCreateCompany(user.id);
    if (!canCreate) {
      throw new Error('Has alcanzado el límite de empresas para tu plan actual');
    }

    return this.companiesService.createCompany(user.id, input);
  }

  /**
   * Obtener todas las empresas del usuario
   * Requiere autenticación
   */
  @Query(() => [Company])
  @UseGuards(JwtAuthGuard)
  async myCompanies(@CurrentUser() user: any): Promise<Company[]> {
    return this.companiesService.getUserCompanies(user.id);
  }

  /**
   * Obtener una empresa específica
   * Requiere autenticación
   */
  @Query(() => Company)
  @UseGuards(JwtAuthGuard)
  async company(
    @Args('id') id: string,
    @CurrentUser() user: any,
  ): Promise<Company> {
    return this.companiesService.getCompanyById(user.id, id);
  }

  /**
   * Actualizar una empresa
   * Requiere autenticación
   */
  @Mutation(() => Company)
  @UseGuards(JwtAuthGuard)
  async updateCompany(
    @Args('id') id: string,
    @Args('input') input: UpdateCompanyInput,
    @CurrentUser() user: any,
  ): Promise<Company> {
    return this.companiesService.updateCompany(user.id, id, input);
  }

  /**
   * Eliminar una empresa
   * Requiere autenticación
   */
  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async deleteCompany(
    @Args('id') id: string,
    @CurrentUser() user: any,
  ): Promise<boolean> {
    return this.companiesService.deleteCompany(user.id, id);
  }

  /**
   * Verificar si el usuario puede crear más empresas
   * Requiere autenticación
   */
  @Query(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async canCreateCompany(@CurrentUser() user: any): Promise<boolean> {
    return this.companiesService.canCreateCompany(user.id);
  }
}
