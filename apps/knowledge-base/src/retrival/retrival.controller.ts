import { Controller, UsePipes, ValidationPipe } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import { GetRelevantChunks } from "./dto/get-relevant-chunks.dto.js";
import { Metadata } from "@grpc/grpc-js";
import { RetrivalService } from "./retrival.service.js";
import { RpcExceptionPipe } from "@cntx/common";

@Controller()
export class RetrivalController {
    constructor(private readonly retrivalService: RetrivalService) {}
    @UsePipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            exceptionFactory: RpcExceptionPipe
        })
    )
    @GrpcMethod('RetrivalService')
    GetRelevantChunks(dto: GetRelevantChunks, metadata: Metadata) {
        const userId = metadata.get('X-User-Id')[0] as string;
        return this.retrivalService.getRelevantChunks(dto, userId);
    }
}