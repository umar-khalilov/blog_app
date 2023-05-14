import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
    BaseEntity,
    CreateDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@ObjectType({ isAbstract: true, description: 'Abstract model' })
export abstract class AbstractModel extends BaseEntity {
    @Field(() => Int, { nullable: false, description: 'Primary Key' })
    @PrimaryGeneratedColumn('increment')
    readonly id: number;

    @Field({ nullable: false, description: 'Created at' })
    @CreateDateColumn({
        type: 'timestamptz',
    })
    readonly createdAt: Date;

    @Field({ nullable: false, description: 'Updated at' })
    @UpdateDateColumn({
        type: 'timestamptz',
    })
    readonly updatedAt: Date;
}
