import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';

export class UserParamDto {
    @ApiProperty({
        example: 1,
        description: 'Primary key',
        type: 'integer',
        format: 'int64',
    })
    @IsInt({ message: 'userId must be an integer value' })
    @Type(() => Number)
    @IsNotEmpty({ message: 'userId cannot be an empty value' })
    readonly userId: number;
}
