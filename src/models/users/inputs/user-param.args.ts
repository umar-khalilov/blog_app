import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

@ArgsType()
export class UserParamArgs {
    @Field(() => Int, { nullable: false, description: 'Primary key' })
    @IsInt({ message: 'userId must be an integer value' })
    @Type(() => Number)
    @IsNotEmpty({ message: 'userId cannot be an empty value' })
    readonly userId: number;
}
