import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { iamProtoPath } from '@cntx/rpc-protos';

import { AuthController } from './auth.controller.js';
import { AuthGatewayService } from './auth.service.js';
import { IAM_CLIENT } from './auth.constants.js';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: IAM_CLIENT,
                transport: Transport.GRPC,
                options: {
                    url: process.env.IAM_GRPC_URL ?? 'localhost:3001',
                    package: 'iam',
                    protoPath: iamProtoPath,
                },
            },
        ]),
    ],
    controllers: [AuthController],
    providers: [AuthGatewayService],
})
export class AuthModule {}

