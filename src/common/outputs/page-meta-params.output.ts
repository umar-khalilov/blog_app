import { Field, Int, ObjectType } from '@nestjs/graphql';
import { PageOptionsArgs } from './page-options.args';

@ObjectType({ isAbstract: true })
export class PageMetaParamsOutput {
    @Field(() => PageOptionsArgs)
    readonly pageOptionsArgs: PageOptionsArgs;

    @Field(() => Int)
    readonly itemCount: number;
}
