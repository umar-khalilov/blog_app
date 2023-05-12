import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';
import { BlogParamsDto } from '@/models/blogs/dto/blog-params.dto';

export class PostParamsDto extends BlogParamsDto {
    @ApiProperty({
        example: 1,
        description: 'Primary key',
        type: 'integer',
        format: 'int64',
    })
    @IsInt({ message: 'postId must be an integer value' })
    @Type(() => Number)
    @IsNotEmpty({ message: 'postId cannot be an empty value' })
    readonly postId: number;
}
