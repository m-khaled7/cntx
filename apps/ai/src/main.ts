import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import {MicroserviceOptions, Transport} from '@nestjs/microservices'
import {aiProtoPath} from '@cntx/rpc-protos'
async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.GRPC,
      options: {
          url: `0.0.0.0:${process.env.PORT ?? 3004}`,
          package: 'ai',
          protoPath: aiProtoPath,
      },
  });
  await app.listen();
}
bootstrap();
