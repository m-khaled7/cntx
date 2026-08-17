import {
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    HttpException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    UnauthorizedException,
} from '@nestjs/common';
import { status } from '@grpc/grpc-js';

interface GrpcError {
    code?: status;
    details?: string;
    message?: string;
}

export function mapGrpcErrorToHttpException(error: unknown): HttpException {
    const grpcError = error as GrpcError;
    const message = grpcError.details ?? grpcError.message ?? 'gRPC service request failed';

    switch (grpcError.code) {
        case status.INVALID_ARGUMENT:
        case status.FAILED_PRECONDITION:
        case status.OUT_OF_RANGE:
            return new BadRequestException(message);
        case status.UNAUTHENTICATED:
            return new UnauthorizedException(message);
        case status.PERMISSION_DENIED:
            return new ForbiddenException(message);
        case status.NOT_FOUND:
            return new NotFoundException(message);
        case status.ALREADY_EXISTS:
            return new ConflictException(message);
        case status.UNAVAILABLE:
            return new ServiceUnavailableException(message);
        case status.DEADLINE_EXCEEDED:
            return new GatewayTimeoutException(message);
        case status.INTERNAL:
        case status.DATA_LOSS:
        case status.UNKNOWN:
            return new InternalServerErrorException(message);
        default:
            return new BadGatewayException(message);
    }
}

