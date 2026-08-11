import { Module } from "@nestjs/common";
import { UsersModule } from "../user/user.module.js";
import { AuthService } from "./auth.service.js";
import { AuthController } from "./auth.controller.js";
import { JwtModule } from "@nestjs/jwt";
import { AuthSecurity } from "./auth.security.js";

@Module({
    imports: [UsersModule,JwtModule.register({})],
    controllers: [AuthController],
    providers: [AuthService,AuthSecurity],
})
export class AuthModule {}
