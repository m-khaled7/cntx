import { Repository } from "typeorm";
import { Asset } from "../entities/asset.entity.js";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AssetsRepository{
    constructor(@InjectRepository(Asset) private readonly repository:Repository<Asset>){}

    createAsset(data:Asset){
        return this.repository.create(data)
    }

    async saveAsset(entity:Asset){
        return this.repository.save(entity)
    }
}