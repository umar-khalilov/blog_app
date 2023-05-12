import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateBlogDto {
    @ApiProperty({ example: 'Sport meal', description: 'Name of blog' })
    @Length(5, 300, {
        message: 'name cannot be less than 5 and more than 300 characters',
    })
    @IsString({ message: 'name must be a string value' })
    @IsNotEmpty({ message: 'name cannot be an empty value' })
    readonly name: string;

    @ApiProperty({ example: 'bla-bla-bla', description: 'Blog details' })
    @Length(5, 3000, {
        message:
            'descrtiption cannot be less than 5 and more than 3000 characters',
    })
    @IsString({ message: 'descrtiption must be a string value' })
    @IsNotEmpty({ message: 'descrtiption cannot be an empty value' })
    readonly description: string;
}
