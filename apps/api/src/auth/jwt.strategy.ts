import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      // Extraer JWT del header Authorization: Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // No ignorar la expiración
      ignoreExpiration: false,
      // Secret para verificar el token
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  /**
   * Este método se ejecuta cuando el token es válido
   * Aquí podemos cargar datos adicionales del usuario
   */
  async validate(payload: any) {
    const user = await this.authService.validateUser(payload.sub);
    
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    // Lo que devolvamos aquí estará disponible en req.user
    return user;
  }
}
