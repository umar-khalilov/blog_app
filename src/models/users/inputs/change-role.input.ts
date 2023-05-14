import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEnum, IsInt, IsNotEmpty } from 'class-validator';
import { RoleTypes } from '@/common/enums/role-types.enum';

@InputType()
export class ChangeRoleInput {
    @Field(() => Int, { nullable: false, description: 'User id' })
    @IsInt({ message: 'userId must be an integer value' })
    @IsNotEmpty({ message: 'userId cannot be an empty value' })
    readonly userId: number;

    @Field(() => RoleTypes, { nullable: false, description: 'Role value' })
    @IsEnum(RoleTypes, { message: 'role must be an enum value' })
    @IsNotEmpty({ message: 'role cannot be an empty value' })
    readonly role: RoleTypes;
}
