import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { BlogParamArgs } from '@/models/blogs/inputs/blog-param.args';

@ArgsType()
export class PostParamArgs extends BlogParamArgs {
    @Field(() => Int, { nullable: false, description: 'Primary key' })
    @IsInt({ message: 'postId must be an integer value' })
    @Type(() => Number)
    @IsNotEmpty({ message: 'postId cannot be an empty value' })
    readonly postId: number;
}
