import { Controller, Logger } from '@nestjs/common';
import { ProcessService } from './process.service.js';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { UploadedFileEventDto } from './dto/uploaded-file-event.dto.js';

@Controller()
export class ProcessController {
    constructor(private readonly processService: ProcessService) {}
        private readonly logger = new Logger(ProcessController.name);
    
    @EventPattern('file.uploaded')
    async handleUploadedFile(@Payload() data: UploadedFileEventDto, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();

        try {
            await this.processService.processFile(data);
            channel.ack(originalMsg);
        } catch (err) {
            this.logger.error('proccess file failed',data,err)
            channel.nack(originalMsg, false, false);
        }
    }
}
