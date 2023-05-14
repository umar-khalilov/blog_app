import { Field, Int, ObjectType } from '@nestjs/graphql';
import { PageMetaParamsOutput } from './page-meta-params.output';

@ObjectType({ description: 'Page meta model' })
export class PageMetaOutput {
    @Field(() => Int, { description: 'Page number' })
    readonly page: number;

    @Field(() => Int, { description: 'Take number' })
    readonly take: number;

    @Field(() => Int, { description: 'Item count' })
    readonly itemCount: number;

    @Field(() => Int, { description: 'Page count' })
    readonly pageCount: number;

    @Field(() => Boolean, { description: 'Has previous page' })
    readonly hasPreviousPage: boolean;

    @Field(() => Boolean, { description: 'Has next page' })
    readonly hasNextPage: boolean;

    constructor({ pageOptionsArgs, itemCount }: PageMetaParamsOutput) {
        this.page = pageOptionsArgs.page;
        this.take = pageOptionsArgs.take;
        this.itemCount = itemCount;
        this.pageCount = Math.ceil(this.itemCount / this.take);
        this.hasPreviousPage = this.page > 1;
        this.hasNextPage = this.page < this.pageCount;
    }
}
