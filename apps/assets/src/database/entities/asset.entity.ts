
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("assets")
export class Asset {
    @PrimaryGeneratedColumn('uuid')
    id:string

    @Column()
    assetName:string

    @Column()
    originalName:string

    @Column()
    mimeType:string

    @Column()
    size:number

    @Column()
    userId:string

    @CreateDateColumn()
    createdAt:Date
}
