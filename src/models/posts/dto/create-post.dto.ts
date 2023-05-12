import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreatePostDto {
    @ApiProperty({ example: 'Java vs JavaScript', description: 'Title' })
    @Length(5, 450, {
        message: 'title cannot be less than 5 and more than 450 characters',
    })
    @IsString({ message: 'title must be a string value' })
    @IsNotEmpty({ message: 'title cannot be an empty value' })
    readonly title: string;

    @ApiProperty({ example: 'bla-bla-bla', description: 'Content' })
    @Length(5, 5000, {
        message: 'content cannot be less than 5 and more than 5000 characters',
    })
    @IsString({ message: 'content must be a string value' })
    @IsNotEmpty({ message: 'content cannot be an empty value' })
    readonly content: string;

    @ApiProperty({
        example: false,
        description: 'Archived or not',
    })
    @IsBoolean({ message: 'isArchived must be a boolean value' })
    @IsNotEmpty({ message: 'isArchived cannot be an empty value' })
    readonly isArchived: boolean;
}
