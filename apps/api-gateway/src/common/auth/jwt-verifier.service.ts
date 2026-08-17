import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import type { AuthenticatedUser } from './authenticated-request.interface.js';
import type { JwtPayload } from './jwt-payload.interface.js';

@Injectable()
export class JwtVerifierService {
    constructor(private readonly jwtService: JwtService) {}

    async verifyAccessToken(token: string): Promise<AuthenticatedUser> {
        const accessSecret = process.env.JWT_ACCESS_SECRET;
        if (!accessSecret) {
            throw new UnauthorizedException('JWT access secret is not configured');
        }

        try {
            const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
                secret: accessSecret,
            });

            if (!payload.sub || !payload.email) {
                throw new UnauthorizedException('Invalid JWT payload');
            }

            return { id: payload.sub, email: payload.email };
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw error;
            }
            throw new UnauthorizedException('Invalid JWT token');
        }
    }
}

