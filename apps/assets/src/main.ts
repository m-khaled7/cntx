import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { assetsProtoPath } from '@cntx/rpc-protos';

async function bootstrap() {
    const port = Number(process.env.PORT ?? 3002);
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
        transport: Transport.GRPC,
        options: {
            url: `0.0.0.0:${port}`,
            package: 'assets',
            protoPath: assetsProtoPath,
        },
    });
    await app.listen();
}
void bootstrap();
