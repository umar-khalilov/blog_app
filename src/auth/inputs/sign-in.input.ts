import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

@InputType()
export class SignInInput {
    @Field({ nullable: false, description: 'Email address' })
    @IsEmail({}, { message: 'email must be a valid email address' })
    @Length(5, 350, {
        message: 'email cannot be less 5 and more than 350 characters',
    })
    @IsString({ message: 'email must be a string' })
    @IsNotEmpty({ message: 'email cannot be an empty' })
    readonly email: string;

    @Field({ nullable: false, description: 'Password' })
    @IsString({ message: 'password must be a string' })
    @IsNotEmpty({ message: 'password cannot be an empty' })
    readonly password: string;
}
