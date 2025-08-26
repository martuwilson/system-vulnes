import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { CreateAssetInput } from '../graphql/inputs';
import { Asset } from '../graphql/models';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Resolver(() => Asset)
export class AssetsResolver {
  constructor(private assetsService: AssetsService) {}

  /**
   * Crear un nuevo asset/dominio
   * Requiere autenticación
   */
  @Mutation(() => Asset)
  @UseGuards(JwtAuthGuard)
  async createAsset(
    @Args('input') input: CreateAssetInput,
    @CurrentUser() user: any,
  ): Promise<Asset> {
    // Verificar si el usuario puede crear más assets
    const canCreate = await this.assetsService.canCreateAsset(user.id, input.companyId);
    if (!canCreate) {
      throw new Error('Has alcanzado el límite de dominios para tu plan actual');
    }

    return this.assetsService.createAsset(user.id, input);
  }

  /**
   * Obtener todos los assets de una empresa
   * Requiere autenticación
   */
  @Query(() => [Asset])
  @UseGuards(JwtAuthGuard)
  async companyAssets(
    @Args('companyId') companyId: string,
    @CurrentUser() user: any,
  ): Promise<Asset[]> {
    return this.assetsService.getCompanyAssets(user.id, companyId);
  }

  /**
   * Obtener todos los assets del usuario (de todas sus empresas)
   * Requiere autenticación
   */
  @Query(() => [Asset])
  @UseGuards(JwtAuthGuard)
  async myAssets(@CurrentUser() user: any): Promise<Asset[]> {
    return this.assetsService.getUserAssets(user.id);
  }

  /**
   * Obtener un asset específico
   * Requiere autenticación
   */
  @Query(() => Asset)
  @UseGuards(JwtAuthGuard)
  async asset(
    @Args('id') id: string,
    @CurrentUser() user: any,
  ): Promise<Asset> {
    return this.assetsService.getAssetById(user.id, id);
  }

  /**
   * Desactivar un asset (soft delete)
   * Requiere autenticación
   */
  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async deactivateAsset(
    @Args('id') id: string,
    @CurrentUser() user: any,
  ): Promise<boolean> {
    return this.assetsService.deactivateAsset(user.id, id);
  }

  /**
   * Reactivar un asset
   * Requiere autenticación
   */
  @Mutation(() => Asset)
  @UseGuards(JwtAuthGuard)
  async reactivateAsset(
    @Args('id') id: string,
    @CurrentUser() user: any,
  ): Promise<Asset> {
    return this.assetsService.updateAsset(user.id, id, { isActive: true });
  }

  /**
   * Eliminar un asset permanentemente
   * Requiere autenticación
   */
  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async deleteAsset(
    @Args('id') id: string,
    @CurrentUser() user: any,
  ): Promise<boolean> {
    return this.assetsService.deleteAsset(user.id, id);
  }

  /**
   * Verificar si el usuario puede crear más assets
   * Requiere autenticación
   */
  @Query(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async canCreateAsset(
    @Args('companyId') companyId: string,
    @CurrentUser() user: any,
  ): Promise<boolean> {
    return this.assetsService.canCreateAsset(user.id, companyId);
  }
}
