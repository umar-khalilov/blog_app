import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty, IsString, Length } from 'class-validator';

@InputType()
export class CreatePostInput {
    @Field({ nullable: false, description: 'Post title' })
    @Length(5, 450, {
        message: 'title cannot be less than 5 and more than 450 characters',
    })
    @IsString({ message: 'title must be a string value' })
    @IsNotEmpty({ message: 'title cannot be an empty value' })
    readonly title: string;

    @Field({ nullable: false, description: 'Post content' })
    @Length(5, 5000, {
        message: 'content cannot be less than 5 and more than 5000 characters',
    })
    @IsString({ message: 'content must be a string value' })
    @IsNotEmpty({ message: 'content cannot be an empty value' })
    readonly content: string;

    @Field(() => Boolean, {
        nullable: false,
        description: 'Post archived or not',
    })
    @IsBoolean({ message: 'isArchived must be a boolean value' })
    @IsNotEmpty({ message: 'isArchived cannot be an empty value' })
    readonly isArchived: boolean;
}
