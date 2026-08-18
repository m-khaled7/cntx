import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import databaseConfig from './configs/database.config.js';
import jwtConfig from './configs/jwt.config.js';
import serviceConfig from './configs/service.config.js';
import { envValidationSchema } from './env.validation.js';

@Module({
    imports: [
        NestConfigModule.forRoot({
            isGlobal: true,
            cache: true,
            validationSchema: envValidationSchema,
            envFilePath: [`.env.${process.env.NODE_ENV ?? 'development'}`, '.env'],
            load: [serviceConfig, databaseConfig, jwtConfig],
        }),
    ],
    exports: [NestConfigModule],
})
export class ConfigModule {}
