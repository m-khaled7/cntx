import { status } from "@grpc/grpc-js";
import { RpcException } from "@nestjs/microservices";

export class RpcError extends RpcException {
    constructor(code: status, message: string) {
        super({ code, message });
    }
}
