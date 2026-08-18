import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { StorageService } from './storage.service.js';
import { StorageClient } from './storage-client.js';

describe('StorageService', () => {
    let service: StorageService;
    let mockStorageClient: jest.Mocked<StorageClient>;

    beforeEach(async () => {
        mockStorageClient = {
            createPreSignedPost: jest.fn(),
            getObject: jest.fn(),
            removeObject: jest.fn(),
        } as unknown as jest.Mocked<StorageClient>;

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                StorageService,
                {
                    provide: StorageClient,
                    useValue: mockStorageClient,
                },
            ],
        }).compile();

        service = module.get<StorageService>(StorageService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should create a presigned POST URL with metadata and stringified form data', async () => {
        mockStorageClient.createPreSignedPost.mockResolvedValue({
            postURL: 'http://minio/bucket',
            formData: { key: 'file-123.pdf', policy: 'base64policy' },
        });

        const dto = { fileName: 'test.pdf' };
        const userId = 'user-123';

        const result = await service.createPostUrl(dto, userId);

        expect(mockStorageClient.createPreSignedPost).toHaveBeenCalledWith(
            expect.stringMatching(/^file-.*\.pdf$/),
            {
                uploadedBy: 'user-123',
                originalName: 'test.pdf',
            }
        );

        expect(result).toEqual({
            postURL: 'http://minio/bucket',
            formData: {
                key: 'file-123.pdf',
                policy: 'base64policy',
            },
        });
    });
});
