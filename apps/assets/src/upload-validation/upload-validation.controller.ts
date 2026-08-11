import { Controller, Logger } from '@nestjs/common';
import { UploadValidationService } from './upload-validation.service.js';
import { Nack, RabbitPayload, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import {type  MinioEvent } from './interfaces.js';

@Controller()
export class UploadValidationController {
    private readonly logger = new Logger(UploadValidationController.name);
    constructor(private readonly uploadValidationService: UploadValidationService) {}

    @RabbitSubscribe({
        exchange: 'minio',
        routingKey: 'file.uploaded',
        queue: 'file_upload_queue',
    })
    handleFileUpload(@RabbitPayload()data:MinioEvent ) {
        try {
            this.uploadValidationService.handleUploadedFile(data)
        } catch (err) {
            this.logger.error('Failed to validate uploaded file', err);
            return new Nack(false)
        }
    }
}
