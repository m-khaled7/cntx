import { Module } from '@nestjs/common';
import { UploadValidationService } from './upload-validation.service.js';
import { UploadValidationController } from './upload-validation.controller.js';
import { StorageModule } from '../storage/storage.module.js';
import { DatabaseModule } from '../database/database.module.js';

@Module({
  imports:[StorageModule,DatabaseModule],
  controllers: [UploadValidationController],
  providers: [UploadValidationService],
})
export class UploadValidationModule {}
