import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module.js';
import { JwtVerifierModule } from './common/auth/jwt-verifier.module.js';

@Module({
    imports: [JwtVerifierModule, AuthModule],
})
export class AppModule {}
