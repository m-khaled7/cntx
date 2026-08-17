import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { AUTHORIZATION_HTTP_HEADER } from './auth.constants.js';
import type { AuthenticatedRequest } from './authenticated-request.interface.js';
import { extractBearerToken } from './bearer-token.js';
import { JwtVerifierService } from './jwt-verifier.service.js';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private readonly jwtVerifier: JwtVerifierService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
        const token = extractBearerToken(request.headers[AUTHORIZATION_HTTP_HEADER]);

        request.user = await this.jwtVerifier.verifyAccessToken(token);

        return true;
    }
}

