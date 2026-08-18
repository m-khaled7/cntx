import { status } from '@grpc/grpc-js';
import { Injectable } from '@nestjs/common';
import { RpcError } from '../common/errors/rpc.error.js';
import { User } from '../user/entites/users.entity.js';
import { UsersService } from '../user/user.service.js';
import { AuthSecurity } from './auth.security.js';
import type { TokenPair } from './auth.types.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';

@Injectable()
export class AuthService {
    constructor(
        private readonly users: UsersService,
        private readonly authSecurity: AuthSecurity,
    ) {}

    async register(dto: RegisterDto): Promise<TokenPair> {
        const { password, confirmPassword, ...dtoData } = dto;

        if (confirmPassword !== password) {
            throw new RpcError(status.INVALID_ARGUMENT, 'Confirm password mismatch password.');
        }

        if (await this.users.findByEmail(dto.email)) {
            throw new RpcError(status.ALREADY_EXISTS, 'An account with this email already exists');
        }

        const user = await this.users.create({
            ...dtoData,
            passwordHash: await this.authSecurity.hashPassword(password),
        });

        return this.createSession(user.id, user.email);
    }

    async login(dto: LoginDto): Promise<TokenPair> {
        const { email, password } = dto;
        const user = await this.users.findByEmail(email, true);

        if (!user || !(await this.authSecurity.passwordMatches(password, user.passwordHash))) {
            throw new RpcError(status.UNAUTHENTICATED, 'Invalid credentials');
        }

        return this.createSession(user.id, user.email);
    }

    async logout(accessToken: string): Promise<void> {
        const payload = await this.authSecurity.validateAccess(accessToken);
        await this.users.setRefreshToken(payload.sub, null);
    }

    async refresh(refreshToken: string): Promise<TokenPair> {
        const user = await this.getUserForRefreshToken(refreshToken);
        return this.createSession(user.id, user.email);
    }

    async acquireAuth(accessToken: string) {
        const payload = await this.authSecurity.validateAccess(accessToken);
        return { userId: payload.sub, email: payload.email };
    }

    async aquireAuth(accessToken: string) {
        return this.acquireAuth(accessToken);
    }

    private async getUserForRefreshToken(refreshToken: string): Promise<User> {
        const payload = await this.authSecurity.validateRefresh(refreshToken);
        const user = await this.users.findByEmail(payload.email, true);

        if (
            !user ||
            !user.refreshTokenHash ||
            !(await this.authSecurity.refreshTokenMatches(refreshToken, user.refreshTokenHash))
        ) {
            throw new RpcError(status.PERMISSION_DENIED, 'Invalid refresh token');
        }

        return user;
    }

    private async createSession(userId: string, email: string): Promise<TokenPair> {
        const { accessToken, refreshToken } = await this.authSecurity.createTokens(userId, email);
        const refreshTokenHash = await this.authSecurity.hashRefreshToken(refreshToken);
        await this.users.setRefreshToken(userId, refreshTokenHash);
        return { accessToken, refreshToken };
    }
}
