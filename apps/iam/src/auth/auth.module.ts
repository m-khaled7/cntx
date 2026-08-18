import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../user/user.module.js';
import { AuthController } from './auth.controller.js';
import { AuthSecurity } from './auth.security.js';
import { AuthService } from './auth.service.js';

@Module({
    imports: [UsersModule, JwtModule.register({})],
    controllers: [AuthController],
    providers: [AuthService, AuthSecurity],
})
export class AuthModule {}
