import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class ApiLog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    path: string;

    @Column()
    log: string;

    @CreateDateColumn()
    createdAt: Date;
}
