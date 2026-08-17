import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('chunks')
export class ChunkEntity {
    @PrimaryGeneratedColumn('uuid') id: string;

    @Column('text') content: string;

    @Column({type:"vector",length:1536}) embedding: number[];

    @Column('uuid') userId: string;
    @Column('uuid') assetId: string;
    @Column('int') chunkIndex: number;
    @Column('jsonb', { nullable: true }) metadata?: Record<string, unknown>|undefined

    @CreateDateColumn() createdAt: Date;
}
