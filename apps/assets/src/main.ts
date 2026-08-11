import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { assetsProtoPath } from '@cntx/rpc-protos';

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.GRPC,
      options: {
          url: `0.0.0.0:${process.env.PORT ?? 3002}`,
          package: 'assets',
          protoPath: assetsProtoPath,
      },
  })
  app.startAllMicroservices()
}
bootstrap();
