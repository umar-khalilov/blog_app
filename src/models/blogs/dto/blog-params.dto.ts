import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';
import { UserParamDto } from '@/models/users/dto/user-param.dto';

export class BlogParamsDto extends UserParamDto {
    @ApiProperty({
        example: 1,
        description: 'Primary key',
        type: 'integer',
        format: 'int64',
    })
    @IsInt({ message: 'blogId must be an integer value' })
    @Type(() => Number)
    @IsNotEmpty({ message: 'blogId cannot be an empty value' })
    readonly blogId: number;
}
