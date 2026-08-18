import { registerAs } from '@nestjs/config';
import type { JwtSignOptions } from '@nestjs/jwt';

export interface JWTConfig {
    accessSecret: string;
    refreshSecret: string;
    accessExp: JwtSignOptions['expiresIn'];
    refreshExp: JwtSignOptions['expiresIn'];
}
export default registerAs(
    'jwt',
    (): JWTConfig => ({
        accessSecret: process.env.JWT_ACCESS_SECRET!,
        refreshSecret: process.env.JWT_REFRESH_SECRET!,
        accessExp: '30m',
        refreshExp: '7d',
    }),
);
