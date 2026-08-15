import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { knowledgeBaseProtoPath } from '@cntx/rpc-protos';
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.RMQ,
        options: {
            urls: [process.env.RMQ_URL!],
            queue: 'knowledge-base-queue',
            queueOptions: { durable: true },
            noAck: false,
        },
    });
    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.GRPC,
        options: {
            url: `0.0.0.0:${process.env.PORT ?? 3003}`,
            package: 'knowledgeBase',
            protoPath: knowledgeBaseProtoPath,
        },
    });
    await app.startAllMicroservices()
    await app.init()
}
bootstrap();
