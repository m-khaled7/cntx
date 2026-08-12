import { Controller } from '@nestjs/common';
import { ProcessService } from './process.service.js';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { type UploadedFileData } from './process.interfaces.js';

@Controller()
export class ProcessController {
    constructor(private readonly processService: ProcessService) {}
    
    @EventPattern('file.uploaded')
    async handleUploadedFile(@Payload() data: UploadedFileData, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();

        try {
            await this.processService.processFile(data);
            channel.ack(originalMsg);
        } catch (err) {
            channel.nack(originalMsg, false, false);
        }
    }
}
