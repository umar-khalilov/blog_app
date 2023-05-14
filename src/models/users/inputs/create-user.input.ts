import { Field, InputType } from '@nestjs/graphql';
import {
    IsEmail,
    IsNotEmpty,
    IsString,
    Length,
    Matches,
} from 'class-validator';

@InputType()
export class CreateUserInput {
    @Field({ nullable: false, description: 'The name of user' })
    @Length(3, 450, {
        message: 'name cannot be less 3 and more than 450 characters',
    })
    @IsString({ message: 'name must be a string' })
    @IsNotEmpty({ message: 'name cannot be an empty' })
    readonly name: string;

    @Field({ nullable: false, description: 'The surname of user' })
    @Length(3, 450, {
        message: 'surname cannot be less 3 and more than 450 characters',
    })
    @IsString({ message: 'surname must be a string' })
    @IsNotEmpty({ message: 'surname cannot be an empty' })
    readonly surname: string;

    @Field({ nullable: false, description: 'The email of user' })
    @IsEmail({}, { message: 'email must be a valid email address' })
    @Length(5, 350, {
        message: 'email cannot be less 5 and more than 350 characters',
    })
    @IsString({ message: 'email must be a string' })
    @IsNotEmpty({ message: 'email cannot be an empty' })
    readonly email: string;

    @Field({ nullable: false, description: 'Password' })
    @Matches(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,32}$/,
        {
            message:
                'password cannot be less than 8 and no more than 32 characters',
        },
    )
    @IsString({ message: 'password must be a string' })
    @IsNotEmpty({ message: 'password cannot be an empty' })
    password: string;
}
