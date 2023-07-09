import { Field, ObjectType } from '@nestjs/graphql';
import { PageMetaOutput } from './page-meta.output';
import { IClassType } from '@/common/interfaces/class-type.interface';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const PaginationResponse = <TItem>(TItemClass: IClassType<TItem>) => {
    @ObjectType({ isAbstract: true })
    class PaginatedResponse {
        @Field(() => [TItemClass])
        readonly data: TItem[];

        @Field(() => PageMetaOutput, { description: 'Meta data' })
        readonly meta: PageMetaOutput;

        constructor(items: TItem[], meta: PageMetaOutput) {
            this.data = items;
            this.meta = meta;
        }
    }
    return PaginatedResponse;
};
