import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AssetsRepository } from './assets.repository.js';
import { Asset } from '../entities/asset.entity.js';
import { Repository } from 'typeorm';

describe('AssetsRepository', () => {
    let repository: AssetsRepository;
    let mockTypeOrmRepo: jest.Mocked<Repository<Asset>>;

    beforeEach(async () => {
        mockTypeOrmRepo = {
            create: jest.fn(),
            save: jest.fn(),
        } as unknown as jest.Mocked<Repository<Asset>>;

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AssetsRepository,
                {
                    provide: getRepositoryToken(Asset),
                    useValue: mockTypeOrmRepo,
                },
            ],
        }).compile();

        repository = module.get<AssetsRepository>(AssetsRepository);
    });

    it('should be defined', () => {
        expect(repository).toBeDefined();
    });

    it('should delegate createAsset to typeorm repository', () => {
        const data: Asset = {
            assetName: 'file-123',
            originalName: 'test.pdf',
            mimeType: 'application/pdf',
            size: 100,
            userId: 'user-1',
        };

        mockTypeOrmRepo.create.mockReturnValue(data);

        const result = repository.createAsset(data);

        expect(mockTypeOrmRepo.create).toHaveBeenCalledWith(data);
        expect(result).toBe(data);
    });

    it('should delegate saveAsset to typeorm repository', async () => {
        const entity: Asset = {
            id: 'uuid-123',
            assetName: 'file-123',
            originalName: 'test.pdf',
            mimeType: 'application/pdf',
            size: 100,
            userId: 'user-1',
        };

        mockTypeOrmRepo.save.mockResolvedValue(entity);

        const result = await repository.saveAsset(entity);

        expect(mockTypeOrmRepo.save).toHaveBeenCalledWith(entity);
        expect(result).toBe(entity);
    });
});
