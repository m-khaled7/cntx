import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { UploadValidationController } from './upload-validation.controller.js';
import { UploadValidationService } from './upload-validation.service.js';
import { Nack } from '@golevelup/nestjs-rabbitmq';
import { UploadedFileEventDto } from './dto/uploaded-file-event.dto.js';

describe('UploadValidationController', () => {
    let controller: UploadValidationController;
    let mockService: jest.Mocked<UploadValidationService>;

    beforeEach(async () => {
        mockService = {
            handleUploadedFile: jest.fn(),
        } as unknown as jest.Mocked<UploadValidationService>;

        const module: TestingModule = await Test.createTestingModule({
            controllers: [UploadValidationController],
            providers: [
                {
                    provide: UploadValidationService,
                    useValue: mockService,
                },
            ],
        }).compile();

        controller = module.get<UploadValidationController>(UploadValidationController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should call handleUploadedFile on RabbitMQ event payload', async () => {
        const dto: UploadedFileEventDto = { Records: [] };
        await controller.handleFileUpload(dto);
        expect(mockService.handleUploadedFile).toHaveBeenCalledWith(dto);
    });

    it('should return Nack(false) if handleUploadedFile throws error', async () => {
        const dto: UploadedFileEventDto = { Records: [] };
        mockService.handleUploadedFile.mockRejectedValue(new Error('Processing error'));

        const result = await controller.handleFileUpload(dto);

        expect(result).toBeInstanceOf(Nack);
    });
});
