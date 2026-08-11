import { status } from "@grpc/grpc-js";
import { ValidationError } from "@nestjs/common";
import { RpcError } from "../errors/rpc.error.js";

export const RpcExceptionPipe = (errors: ValidationError[]) => {
    const msg = errors.map((e) => ({
        field: e.property,
        constrains: Object.values(e.constraints ?? {}),
    }));
    return new RpcError(status.INVALID_ARGUMENT, JSON.stringify(msg));
};
