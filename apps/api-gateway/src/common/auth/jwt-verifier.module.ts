import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { JwtAuthGuard } from './jwt-auth.guard.js';
import { JwtVerifierService } from './jwt-verifier.service.js';

@Global()
@Module({
    imports: [JwtModule.register({})],
    providers: [JwtVerifierService, JwtAuthGuard],
    exports: [JwtVerifierService, JwtAuthGuard],
})
export class JwtVerifierModule {}
