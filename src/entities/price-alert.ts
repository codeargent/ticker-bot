import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class PriceAlert {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    pair: string;

    @Column({
        type: 'decimal',
        transformer: {
            from: (value: string) => parseFloat(value),
            to: (value: number) => value,
        },
    })
    oscillation: number;

    @Column({
        type: 'decimal',
        transformer: {
            from: (value: string) => parseFloat(value),
            to: (value: number) => value,
        },
    })
    currentRate: number;

    @Column({
        type: 'decimal',
        transformer: {
            from: (value: string) => parseFloat(value),
            to: (value: number) => value,
        },
    })
    lastRate: number;

    @Column({
        type: 'decimal',
        transformer: {
            from: (value: string) => parseFloat(value),
            to: (value: number) => value,
        },
    })
    threshold: number;

    @Column({
        type: 'decimal',
        transformer: {
            from: (value: string) => parseFloat(value),
            to: (value: number) => value,
        },
    })
    interval: number;

    @CreateDateColumn()
    createdAt: Date;
}
