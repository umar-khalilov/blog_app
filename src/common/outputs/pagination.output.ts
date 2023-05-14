import { Field, ObjectType } from '@nestjs/graphql';
import { IsArray } from 'class-validator';
import { PageMetaOutput } from './page-meta.output';

@ObjectType()
export class PaginationOutput<T> {
    // @Field()
    @IsArray()
    readonly data: T[];

    @Field(() => PageMetaOutput, { description: 'Meta data' })
    readonly meta: PageMetaOutput;

    constructor(data: T[], meta: PageMetaOutput) {
        this.data = data;
        this.meta = meta;
    }
}
