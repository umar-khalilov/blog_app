import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty } from 'class-validator';
import { RoleTypes } from '@/common/enums/role-types.enum';

export class ChangeRoleDto {
    @ApiProperty({ example: 1, description: 'User id' })
    @IsInt({ message: 'userId must be an integer value' })
    @IsNotEmpty({ message: 'userId cannot be an empty value' })
    readonly userId: number;

    @ApiProperty({
        example: RoleTypes.WRITER,
        enum: RoleTypes,
        description: 'Role value',
    })
    @IsEnum(RoleTypes, { message: 'role must be an enum value' })
    @IsNotEmpty({ message: 'role cannot be an empty value' })
    readonly role: RoleTypes;
}
