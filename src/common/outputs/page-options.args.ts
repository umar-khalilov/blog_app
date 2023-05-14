import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { SortOrder } from '../enums/sort-order.enum';

@ArgsType()
export class PageOptionsArgs {
    @Field(() => SortOrder, { nullable: true, description: 'Order' })
    @IsEnum(SortOrder, { message: 'order must be an enum value' })
    @IsOptional()
    readonly order?: SortOrder = SortOrder.ASC;

    @Field(() => Int, { nullable: true, description: 'Page number' })
    @Min(1, { message: 'page cannot be less than 1' })
    @IsInt({ message: 'page must be an integer value' })
    @Type(() => Number)
    @IsOptional()
    readonly page: number = 1;

    @Field(() => Int, { nullable: true, description: 'Take' })
    @Max(50, { message: 'take cannot be more than 50' })
    @Min(1, { message: 'take cannot be less than 1' })
    @IsInt({ message: 'take must be an integer value' })
    @Type(() => Number)
    @IsOptional()
    readonly take: number = 10;

    get skip(): number {
        return (this.page - 1) * this.take;
    }
}
