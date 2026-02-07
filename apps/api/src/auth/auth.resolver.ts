import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterInput, LoginInput } from '../graphql/inputs';
import { AuthResponse } from '../graphql/responses';
import { User } from '../graphql/models';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './current-user.decorator';

@Resolver(() => User)
export class AuthResolver {
  constructor(private authService: AuthService) {}

  /**
   * Mutation para registrar un nuevo usuario
   * No requiere autenticación
   */
  @Mutation(() => AuthResponse)
  async register(@Args('input') input: RegisterInput): Promise<AuthResponse> {
    return this.authService.register(input);
  }

  /**
   * Mutation para hacer login
   * No requiere autenticación
   */
  @Mutation(() => AuthResponse)
  async login(@Args('input') input: LoginInput): Promise<AuthResponse> {
    return this.authService.login(input);
  }

  /**
   * Mutation para renovar access token
   * No requiere autenticación (usa refresh token)
   */
  @Mutation(() => AuthResponse)
  async refreshToken(@Args('refreshToken') refreshToken: string): Promise<AuthResponse> {
    return this.authService.refreshToken(refreshToken);
  }

  /**
   * Query para obtener el usuario actual
   * Requiere autenticación
   */
  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user: User): Promise<User> {
    return user;
  }

  /**
   * Mutation para actualizar perfil de usuario
   * Requiere autenticación
   */
  @Mutation(() => User)
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @CurrentUser() user: User,
    @Args('firstName') firstName: string,
    @Args('lastName') lastName: string,
  ): Promise<User> {
    return this.authService.updateProfile(user.id, { firstName, lastName });
  }
}
