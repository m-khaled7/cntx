import { Injectable } from '@nestjs/common';
import { ChunkEntity } from '../entities/chunk.entity.js';
import { QueryDeepPartialEntity, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HybridSearchResult } from '../data-store.interfaces.js';
@Injectable()
export class ChunksRepository {
    constructor(@InjectRepository(ChunkEntity) private readonly repo: Repository<ChunkEntity>) {}

    createEntity(data: Partial<ChunkEntity>) {
        return this.repo.create(data);
    }

    insertMany(chunks: ChunkEntity[]) {
        return this.repo
            .createQueryBuilder()
            .insert()
            .into(ChunkEntity)
            .values(chunks as QueryDeepPartialEntity<ChunkEntity>[])
            .orUpdate(['content', 'embedding', 'metadata'], ['id'])
            .execute();
    }
    /**
     * Inserts many chunks in batches of `batchSize`, sequentially,
     * all within a single transaction. If any batch fails, the whole
     * transaction is rolled back (nothing is persisted).
     */
    async insertManyInBatches(chunks: ChunkEntity[], batchSize = 10): Promise<void> {
        if (chunks.length === 0) return;

        const batches = this.chunkArray(chunks, batchSize);
        const queryRunner = this.repo.manager.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            for (const batch of batches) {
                await queryRunner.manager
                    .createQueryBuilder()
                    .insert()
                    .into(ChunkEntity)
                    .values(batch as QueryDeepPartialEntity<ChunkEntity>[])
                    .orUpdate(['content', 'embedding', 'metadata'], ['id'])
                    .execute();
            }

            await queryRunner.commitTransaction();
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    async hybridSearch(
        userId: string,
        embedding: number[],
        queryText: string,
        poolSize: number,
        topK: number
    ): Promise<HybridSearchResult[]> {
        const embeddingLiteral = `[${embedding.join(',')}]`;

        return this.repo.query(
            `
        WITH vector_results AS (
            SELECT id, content, metadata,
                   ROW_NUMBER() OVER (ORDER BY embedding <=> $1) AS rank
            FROM chunks
            WHERE "userId" = $2
            ORDER BY embedding <=> $1
            LIMIT $3
        ),
        keyword_results AS (
            SELECT id, content, metadata,
                   ROW_NUMBER() OVER (ORDER BY paradedb.score(id) DESC) AS rank
            FROM chunks
            WHERE id @@@ paradedb.parse($4)
              AND "userId" = $2
            LIMIT $3
        )
        SELECT
            COALESCE(v.id, k.id) AS id,
            COALESCE(v.content, k.content) AS content,
            COALESCE(v.metadata, k.metadata) AS metadata,
            (COALESCE(1.0 / (60 + v.rank), 0) + COALESCE(1.0 / (60 + k.rank), 0))::float8 AS rrf_score
        FROM vector_results v
        FULL OUTER JOIN keyword_results k ON v.id = k.id
        ORDER BY rrf_score DESC
        LIMIT $5
        `,
            [embeddingLiteral, userId, poolSize, queryText, topK]
        );
    }

    vectorSearch(userId: string, embedding: number[], topK: number) {
        return this.repo
            .createQueryBuilder('c')
            .where('c.userId = :userId', { userId })
            .orderBy('c.embedding <=> :embedding')
            .setParameter('embedding', `[${embedding.join(',')}]`)
            .limit(topK)
            .getMany();
    }

    keywordSearch(userId: string, queryText: string, topK: number) {
        return this.repo.query(
            `SELECT id, content, metadata,
            paradedb.score(id) AS rank
     FROM chunks
     WHERE id @@@ paradedb.parse($1)
       AND user_id = $2
     ORDER BY rank DESC
     LIMIT $3`,
            [queryText, userId, topK]
        );
    }

    private chunkArray<T>(arr: T[], size: number): T[][] {
        const result: T[][] = [];
        for (let i = 0; i < arr.length; i += size) {
            result.push(arr.slice(i, i + size));
        }
        return result;
    }
}
