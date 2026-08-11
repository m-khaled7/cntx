import { Repository } from "typeorm";
import { Asset } from "../entities/asset.entity.js";
import { InjectRepository } from "@nestjs/typeorm";

export class AssetsRepository{
    constructor(@InjectRepository(Asset) private readonly repository:Repository<Asset>){}

    createAsset(data:Partial<Asset>){
        return this.repository.create(data)
    }

    async saveAsset(entity:Partial<Asset>){
        return this.repository.save(entity)
    }
}