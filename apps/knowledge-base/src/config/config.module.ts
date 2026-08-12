import { Module } from '@nestjs/common';
import { ConfigModule as _ConfigModule } from '@nestjs/config';
import serviceConfig from './configs/service.config.js';
import { envValidationSchema } from './env.validation.js';
import minioConfig from './configs/minio.config.js';
import databaseConfig from './configs/database.config.js';

@Module({
    imports: [
        _ConfigModule.forRoot({
            isGlobal: true,
            cache: true,
            validationSchema:envValidationSchema,
            envFilePath: [`.env.${process.env.NODE_ENV ?? "development"}`, ".env"],
            load: [serviceConfig,minioConfig,databaseConfig],
        }),
    ],

})
export class ConfigModule {}
