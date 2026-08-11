import { Module } from "@nestjs/common";
import { ConfigModule as _ConfigModule } from '@nestjs/config';
import serviceConfig from "./configs/service.config.js";
import databaseConfig from "./configs/database.config.js";
import jwtConfig from "./configs/jwt.config.js";
import { envValidationSchema } from "./env.validation.js";
@Module({
    imports: [
        _ConfigModule.forRoot({
            isGlobal: true,
            cache: true,
            validationSchema: envValidationSchema,
            envFilePath: [`.env.${process.env.NODE_ENV ?? "development"}`, ".env"],
            load: [serviceConfig, databaseConfig, jwtConfig],
        }),
    ],
    exports: [ConfigModule],
})
export class ConfigModule {}
