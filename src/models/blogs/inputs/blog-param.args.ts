import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { UserParamArgs } from '@/models/users/inputs/user-param.args';

@ArgsType()
export class BlogParamArgs extends UserParamArgs {
    @Field(() => Int, { nullable: false, description: 'Primary key' })
    @IsInt({ message: 'blogId must be an integer value' })
    @Type(() => Number)
    @IsNotEmpty({ message: 'blogId cannot be an empty value' })
    readonly blogId: number;
}
