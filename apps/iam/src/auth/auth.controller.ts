import { status, type Metadata } from '@grpc/grpc-js';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { RpcError } from '../common/errors/rpc.error.js';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';

const USER_TOKEN_METADATA_KEY = 'X-User-Token';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @GrpcMethod('AuthService')
    register(dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @GrpcMethod('AuthService')
    login(dto: LoginDto) {
        return this.authService.login(dto);
    }

    @GrpcMethod('AuthService')
    logout(_: unknown, metadata: Metadata) {
        return this.authService.logout(this.getRequiredUserToken(metadata));
    }

    @GrpcMethod('AuthService')
    refreshToken(_: unknown, metadata: Metadata) {
        const refreshToken = this.getRequiredUserToken(metadata);
        return this.authService.refresh(refreshToken);
    }

    private getRequiredUserToken(metadata: Metadata): string {
        const [token] = metadata.get(USER_TOKEN_METADATA_KEY);

        if (typeof token !== 'string' || token.length === 0) {
            throw new RpcError(status.UNAUTHENTICATED, 'Missing user token.');
        }

        return token;
    }
}
