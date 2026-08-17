import { UnauthorizedException } from '@nestjs/common';

import { BEARER_AUTH_SCHEME } from './auth.constants.js';

export function extractBearerToken(authorizationHeader?: string | string[]): string {
    const headerValue = Array.isArray(authorizationHeader)
        ? authorizationHeader[0]
        : authorizationHeader;

    if (!headerValue) {
        throw new UnauthorizedException('Authorization header is required');
    }

    const [scheme, token] = headerValue.split(' ');
    if (scheme !== BEARER_AUTH_SCHEME || !token) {
        throw new UnauthorizedException('Authorization header must use Bearer token');
    }

    return token;
}

