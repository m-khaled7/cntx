import { Injectable } from '@nestjs/common';
import { Asset } from './entities/asset.entity.js';
import { AssetsRepository } from './repositories/assets.repository.js';

@Injectable()
export class DatabaseService {
    constructor(private readonly assetRepository: AssetsRepository) {}

    saveAsset(data: Asset) {
        const assetEntity = this.assetRepository.createAsset(data);
        return this.assetRepository.saveAsset(assetEntity);
    }
}
