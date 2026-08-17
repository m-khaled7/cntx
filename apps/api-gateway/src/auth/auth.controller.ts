import { Body, Controller, Headers, Post } from '@nestjs/common';

import { AUTHORIZATION_HTTP_HEADER } from '../common/auth/auth.constants.js';
import { extractBearerToken } from '../common/auth/bearer-token.js';
import { AuthGatewayService } from './auth.service.js';
import type {
    AuthResponse,
    EmptyResponse,
    LoginRequest,
    RegisterRequest,
} from './auth.interfaces.js';

@Controller('auth')
export class AuthController {
    constructor(private readonly authGatewayService: AuthGatewayService) {}

    @Post('register')
    register(@Body() dto: RegisterRequest): Promise<AuthResponse> {
        return this.authGatewayService.register(dto);
    }

    @Post('login')
    login(@Body() dto: LoginRequest): Promise<AuthResponse> {
        return this.authGatewayService.login(dto);
    }

    @Post('refresh-token')
    refreshToken(
        @Headers(AUTHORIZATION_HTTP_HEADER) authorizationHeader?: string | string[]
    ): Promise<AuthResponse> {
        return this.authGatewayService.refreshToken(extractBearerToken(authorizationHeader));
    }

    @Post('logout')
    logout(
        @Headers(AUTHORIZATION_HTTP_HEADER) authorizationHeader?: string | string[]
    ): Promise<EmptyResponse> {
        return this.authGatewayService.logout(extractBearerToken(authorizationHeader));
    }
}
