import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import { firstValueFrom, type Observable } from 'rxjs';

import { mapGrpcErrorToHttpException } from '../common/exceptions/grpc-exception.mapper.js';
import { IAM_CLIENT, USER_TOKEN_METADATA_KEY } from './auth.constants.js';
import type {
    AuthResponse,
    EmptyResponse,
    IamAuthServiceClient,
    LoginRequest,
    RegisterRequest,
} from './auth.interfaces.js';

@Injectable()
export class AuthGatewayService implements OnModuleInit {
    private authService: IamAuthServiceClient;

    constructor(@Inject(IAM_CLIENT) private readonly iamClient: ClientGrpc) {}

    onModuleInit() {
        this.authService = this.iamClient.getService<IamAuthServiceClient>('AuthService');
    }

    register(dto: RegisterRequest): Promise<AuthResponse> {
        return this.callIam(this.authService.register(dto));
    }

    login(dto: LoginRequest): Promise<AuthResponse> {
        return this.callIam(this.authService.login(dto));
    }

    refreshToken(token: string): Promise<AuthResponse> {
        return this.callIam(this.authService.refreshToken({}, this.createTokenMetadata(token)));
    }

    logout(token: string): Promise<EmptyResponse> {
        return this.callIam(this.authService.logout({}, this.createTokenMetadata(token)));
    }

    private createTokenMetadata(token: string): Metadata {
        const metadata = new Metadata();
        metadata.add(USER_TOKEN_METADATA_KEY, token);
        return metadata;
    }

    private async callIam<T>(request: Observable<T>): Promise<T> {
        try {
            return await firstValueFrom(request);
        } catch (error) {
            throw mapGrpcErrorToHttpException(error);
        }
    }
}
