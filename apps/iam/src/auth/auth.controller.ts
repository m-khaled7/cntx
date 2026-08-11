import { Controller} from "@nestjs/common";
import { AuthService } from "./auth.service.js";
import { RegisterDto } from "./dto/register.dto.js";
import { LoginDto } from "./dto/login.dto.js";
import { GrpcMethod } from "@nestjs/microservices";
import { Metadata } from "@grpc/grpc-js";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @GrpcMethod("AuthService")
    register(dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @GrpcMethod("AuthService")
    login(dto: LoginDto) {
        return this.authService.login(dto);
    }

    @GrpcMethod("AuthService")
    logout(_: string, metadata: Metadata){
        const refreshToken = metadata.get("X-User-Token")[0] as string;
        return this.authService.logout(refreshToken);
    }

    @GrpcMethod("AuthService")
    refreshToken(_: string, metadata: Metadata) {
        const refreshToken = metadata.get("X-User-Token")[0] as string;
        return this.authService.refresh(refreshToken);
    }
}
