import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetsRepository } from './repositories/assets.repository.js';
import { DatabaseService } from './database.service.js';
import { Asset } from './entities/asset.entity.js';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: "postgres",
                host: configService.getOrThrow<string>("database.host"),
                port: configService.getOrThrow<number>("database.port"),
                username: configService.getOrThrow<string>("database.username"),
                password: configService.getOrThrow<string>("database.password"),
                database: configService.getOrThrow<string>("database.name"),
                autoLoadEntities:true,
                synchronize: true,
            }),
        }),
        TypeOrmModule.forFeature([Asset])
    ],
    providers:[AssetsRepository,DatabaseService],
    exports:[DatabaseService]
})
export class DatabaseModule {}
