import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, Length } from 'class-validator';

@InputType()
export class CreateBlogInput {
    @Field({ nullable: false, description: 'Blog name' })
    @Length(5, 300, {
        message: 'name cannot be less than 5 and more than 300 characters',
    })
    @IsString({ message: 'name must be a string value' })
    @IsNotEmpty({ message: 'name cannot be an empty value' })
    readonly name: string;

    @Field({ nullable: false, description: 'Blog details' })
    @Length(5, 3000, {
        message:
            'description cannot be less than 5 and more than 3000 characters',
    })
    @IsString({ message: 'description must be a string value' })
    @IsNotEmpty({ message: 'description cannot be an empty value' })
    readonly description: string;
}
