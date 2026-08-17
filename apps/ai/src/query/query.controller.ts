import { Controller } from '@nestjs/common';
import { QueryService } from './query.service.js';
import { QueryDto } from './dto/query.dto.js';
import { Metadata } from '@grpc/grpc-js';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class QueryController {
    constructor(private readonly queryService: QueryService) {}

    @GrpcMethod('QueryService')
    query(dto: QueryDto, metadata: Metadata) {
      const userId = metadata.get('X-User-Id')[0] as string;
      return this.queryService.query(dto,userId)
    }
}
