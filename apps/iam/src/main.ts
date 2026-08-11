import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { iamProtoPath } from '@cntx/rpc-protos';
import { ValidationPipe } from '@nestjs/common';
import { PipeRpcException } from './common/pipes/rpc-exception.pipe.js';

async function bootstrap() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
        transport: Transport.GRPC,
        options: {
            url: `0.0.0.0:${process.env.PORT ?? 3001}`,
            package: 'iam',
            protoPath: iamProtoPath,
        },
    });
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            exceptionFactory: PipeRpcException,
        })
    );
    await app.listen();
}
bootstrap();
