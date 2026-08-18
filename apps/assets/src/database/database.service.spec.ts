import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from './database.service.js';
import { AssetsRepository } from './repositories/assets.repository.js';
import { Asset } from './entities/asset.entity.js';

describe('DatabaseService', () => {
    let service: DatabaseService;
    let mockRepository: jest.Mocked<AssetsRepository>;

    beforeEach(async () => {
        mockRepository = {
            createAsset: jest.fn(),
            saveAsset: jest.fn(),
        } as unknown as jest.Mocked<AssetsRepository>;

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DatabaseService,
                {
                    provide: AssetsRepository,
                    useValue: mockRepository,
                },
            ],
        }).compile();

        service = module.get<DatabaseService>(DatabaseService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should save an asset entity via assetRepository', async () => {
        const assetData: Asset = {
            assetName: 'file-123.pdf',
            originalName: 'test.pdf',
            mimeType: 'application/pdf',
            size: 1024,
            userId: 'user-789',
        };

        const createdEntity = { ...assetData, id: 'uuid-1' };
        mockRepository.createAsset.mockReturnValue(createdEntity);
        mockRepository.saveAsset.mockResolvedValue(createdEntity);

        const result = await service.saveAsset(assetData);

        expect(mockRepository.createAsset).toHaveBeenCalledWith(assetData);
        expect(mockRepository.saveAsset).toHaveBeenCalledWith(createdEntity);
        expect(result).toEqual(createdEntity);
    });
});
