import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1786550078881 implements MigrationInterface {
    name = 'Init1786550078881';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Extensions
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS vector;`);
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS pg_search;`);

        await queryRunner.query(`
      CREATE TABLE "chunks" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "content" text NOT NULL,
        "embedding" vector(1536) NOT NULL,
        "userId" uuid NOT NULL,
        "assetId" uuid NOT NULL,
        "chunkIndex" integer NOT NULL,
        "metadata" jsonb,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_a306e60b8fdf6e7de1be4be1e6a" PRIMARY KEY ("id")
      )
    `);

        await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS chunks_bm25_idx
      ON chunks
      USING bm25 (id, content)
      WITH (key_field = 'id');
    `);

        await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS chunks_embedding_idx
      ON chunks
      USING ivfflat (embedding vector_cosine_ops)
      WITH (lists = 100);
    `);

  
        await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS chunks_user_id_idx ON chunks ("userId");
    `);
        await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS chunks_asset_id_idx ON chunks ("assetId");
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX IF EXISTS chunks_asset_id_idx;`);
        await queryRunner.query(`DROP INDEX IF EXISTS chunks_user_id_idx;`);
        await queryRunner.query(`DROP INDEX IF EXISTS chunks_embedding_idx;`);
        await queryRunner.query(`DROP INDEX IF EXISTS chunks_bm25_idx;`);
        await queryRunner.query(`DROP TABLE "chunks"`);
    }
}
