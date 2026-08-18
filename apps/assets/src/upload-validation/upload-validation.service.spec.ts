import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { UploadValidationService } from './upload-validation.service.js';
import { DatabaseService } from '../database/database.service.js';
import { StorageClient } from '../storage/storage-client.js';
import { ClientProxy } from '@nestjs/microservices';
import { Readable } from 'stream';
import { UploadedFileEventDto } from './dto/uploaded-file-event.dto.js';

describe('UploadValidationService', () => {
    let service: UploadValidationService;
    let mockDatabaseService: jest.Mocked<DatabaseService>;
    let mockStorageClient: jest.Mocked<StorageClient>;
    let mockKnowledgeBase: jest.Mocked<ClientProxy>;

    beforeEach(async () => {
        mockDatabaseService = {
            saveAsset: jest.fn(),
        } as unknown as jest.Mocked<DatabaseService>;

        mockStorageClient = {
            getObject: jest.fn(),
            removeObject: jest.fn(),
            createPreSignedPost: jest.fn(),
        } as unknown as jest.Mocked<StorageClient>;

        mockKnowledgeBase = {
            emit: jest.fn(),
        } as unknown as jest.Mocked<ClientProxy>;

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UploadValidationService,
                {
                    provide: DatabaseService,
                    useValue: mockDatabaseService,
                },
                {
                    provide: StorageClient,
                    useValue: mockStorageClient,
                },
                {
                    provide: 'KNOWLEDGE_BASE_SERVICE',
                    useValue: mockKnowledgeBase,
                },
            ],
        }).compile();

        service = module.get<UploadValidationService>(UploadValidationService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should remove object if userId or originalName metadata is missing', async () => {
        const msg: UploadedFileEventDto = {
            Records: [
                {
                    s3: {
                        bucket: { name: 'documents' },
                        object: {
                            key: 'file-123.pdf',
                            size: 1024,
                            eTag: 'etag',
                            userMetadata: {},
                        },
                    },
                },
            ],
        };

        await service.handleUploadedFile(msg);

        expect(mockStorageClient.removeObject).toHaveBeenCalledWith('file-123.pdf');
        expect(mockDatabaseService.saveAsset).not.toHaveBeenCalled();
    });

    it('should validate plain text file and save asset', async () => {
        const msg: UploadedFileEventDto = {
            Records: [
                {
                    s3: {
                        bucket: { name: 'documents' },
                        object: {
                            key: 'file-456.txt',
                            size: 20,
                            eTag: 'etag',
                            userMetadata: {
                                'X-Amz-Meta-Uploadedby': 'user-1',
                                'X-Amz-Meta-Originalname': 'sample.txt',
                            },
                        },
                    },
                },
            ],
        };

        const stream = Readable.from([Buffer.from('Hello world plain text')]);
        mockStorageClient.getObject.mockResolvedValue(stream);
        mockDatabaseService.saveAsset.mockResolvedValue({
            id: 'asset-uuid-1',
            assetName: 'file-456.txt',
            originalName: 'sample.txt',
            mimeType: 'text/plain',
            size: 20,
            userId: 'user-1',
        });

        await service.handleUploadedFile(msg);

        expect(mockDatabaseService.saveAsset).toHaveBeenCalledWith({
            assetName: 'file-456.txt',
            originalName: 'sample.txt',
            size: 20,
            mimeType: 'text/plain',
            userId: 'user-1',
        });

        expect(mockKnowledgeBase.emit).toHaveBeenCalledWith('file.uploaded', {
            objectName: 'file-456.txt',
            mimeType: 'text/plain',
            userId: 'user-1',
            assetId: 'asset-uuid-1',
        });
    });
});
