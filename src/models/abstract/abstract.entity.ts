import { ApiProperty } from '@nestjs/swagger';
import {
    BaseEntity,
    CreateDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

export abstract class AbstractEntity extends BaseEntity {
    @ApiProperty({
        example: 1,
        description: 'Primary key',
        type: 'integer',
        format: 'int64',
        readOnly: true,
    })
    @PrimaryGeneratedColumn('increment')
    readonly id: number;

    @ApiProperty({
        example: new Date().toISOString(),
        description: 'Created at',
    })
    @CreateDateColumn({
        type: 'timestamptz',
    })
    readonly createdAt: Date;

    @ApiProperty({
        example: new Date().toISOString(),
        description: 'Updated at',
    })
    @UpdateDateColumn({
        type: 'timestamptz',
    })
    readonly updatedAt: Date;
}
