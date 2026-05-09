import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

type JwtPayload = { sub: number; email: string; role: string };

type RequestWithAuthHeader = Request & {
  headers: {
    authorization?: string;
  };
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    const jwtSecret = configService.get<string>('jwt.accessSecret');

    if (!jwtSecret) {
      throw new Error('JWT_ACCESS_SECRET is not configured');
    }

    // passport-jwt exposes Strategy with loose typings; call is safe here.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super({
      jwtFromRequest: (request: RequestWithAuthHeader): string | null => {
        const authorization = request.headers.authorization;
        if (!authorization) {
          return null;
        }

        const [scheme, token] = authorization.split(' ');
        if (scheme?.toLowerCase() !== 'bearer' || !token) {
          return null;
        }

        return token;
      },
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  validate(payload: JwtPayload) {
    if (!payload?.sub) {
      throw new UnauthorizedException('Invalid token payload');
    }

    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
