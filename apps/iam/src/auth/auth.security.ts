import { status } from '@grpc/grpc-js';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, type JwtSignOptions } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { RpcError } from '../common/errors/rpc.error.js';
import { JWTConfig } from '../config/configs/jwt.config.js';
import { TokenPair, TokenPayload } from './auth.types.js';

@Injectable()
export class AuthSecurity {
    private readonly jwtConfig: JWTConfig;

    constructor(
        private readonly config: ConfigService,
        private readonly jwtService: JwtService,
    ) {
        this.jwtConfig = this.config.getOrThrow<JWTConfig>('jwt');
    }

    async hashPassword(password: string): Promise<string> {
        return argon2.hash(password, {
            type: argon2.argon2id,
            memoryCost: 2 ** 16,
            timeCost: 3,
            parallelism: 4,
        });
    }

    async passwordMatches(password: string, storedHash: string): Promise<boolean> {
        return argon2.verify(storedHash, password);
    }

    signToken(
        payload: TokenPayload,
        secret: string,
        expiresIn: JwtSignOptions['expiresIn'],
    ): Promise<string> {
        return this.jwtService.signAsync(payload, { secret, expiresIn });
    }

    async createTokens(userId: string, email: string): Promise<TokenPair> {
        const [accessToken, refreshToken] = await Promise.all([
            this.signToken(
                { sub: userId, email },
                this.jwtConfig.accessSecret,
                this.jwtConfig.accessExp,
            ),
            this.signToken(
                { sub: userId, email },
                this.jwtConfig.refreshSecret,
                this.jwtConfig.refreshExp,
            ),
        ]);
        return { accessToken, refreshToken };
    }

    async verifyToken(token: string, secret: string): Promise<TokenPayload> {
        try {
            return await this.jwtService.verifyAsync<TokenPayload>(token, { secret });
        } catch {
            throw new RpcError(status.INVALID_ARGUMENT, 'Invalid JWT token.');
        }
    }

    async validateAccess(accessToken: string): Promise<TokenPayload> {
        return this.verifyToken(accessToken, this.jwtConfig.accessSecret);
    }

    async validateRefresh(refreshToken: string): Promise<TokenPayload> {
        return this.verifyToken(refreshToken, this.jwtConfig.refreshSecret);
    }

    async hashRefreshToken(token: string): Promise<string> {
        return argon2.hash(token);
    }

    async refreshTokenMatches(token: string, storedHash: string): Promise<boolean> {
        return argon2.verify(storedHash, token);
    }
}
