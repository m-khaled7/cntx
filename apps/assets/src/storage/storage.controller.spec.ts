import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { StorageController } from './storage.controller.js';
import { StorageService } from './storage.service.js';
import { Metadata } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';

describe('StorageController', () => {
    let controller: StorageController;
    let mockStorageService: jest.Mocked<StorageService>;

    beforeEach(async () => {
        mockStorageService = {
            createPostUrl: jest.fn(),
        } as unknown as jest.Mocked<StorageService>;

        const module: TestingModule = await Test.createTestingModule({
            controllers: [StorageController],
            providers: [
                {
                    provide: StorageService,
                    useValue: mockStorageService,
                },
            ],
        }).compile();

        controller = module.get<StorageController>(StorageController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should call storageService.createPostUrl with valid metadata', async () => {
        const metadata = new Metadata();
        metadata.add('X-User-Id', 'user-456');

        mockStorageService.createPostUrl.mockResolvedValue({
            postURL: 'http://minio/bucket',
            formData: { key: 'val' },
        });

        const dto = { fileName: 'document.pdf' };
        const result = await controller.createUploadUrl(dto, metadata);

        expect(mockStorageService.createPostUrl).toHaveBeenCalledWith(dto, 'user-456');
        expect(result).toEqual({
            postURL: 'http://minio/bucket',
            formData: { key: 'val' },
        });
    });

    it('should throw RpcException if X-User-Id is missing in metadata', () => {
        const metadata = new Metadata();
        const dto = { fileName: 'document.pdf' };

        expect(() => controller.createUploadUrl(dto, metadata)).toThrow(RpcException);
    });
});
