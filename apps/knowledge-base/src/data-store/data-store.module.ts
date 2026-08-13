import { Module } from "@nestjs/common";
import { DataStoreService } from "./data-store.service.js";
import { ChunksRepository } from "./repositories/chunks.repository.js";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChunkEntity } from "./entities/chunk.entity.js";

@Module({
    imports:[TypeOrmModule.forRootAsync({
                imports: [ConfigModule],
                inject: [ConfigService],
                useFactory: (configService: ConfigService) => ({
                    type: 'postgres',
                    host: configService.getOrThrow<string>('database.host'),
                    port: configService.getOrThrow<number>('database.port'),
                    username: configService.getOrThrow<string>('database.username'),
                    password: configService.getOrThrow<string>('database.password'),
                    database: configService.getOrThrow<string>('database.name'),
                    autoLoadEntities:true,
                    synchronize: true,
                }),
            }),
        TypeOrmModule.forFeature([ChunkEntity])],
    providers:[DataStoreService,ChunksRepository],
    exports:[DataStoreService]
})
export class DataStoreModule{}