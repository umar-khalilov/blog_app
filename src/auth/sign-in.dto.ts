import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class SignInDto {
    @ApiProperty({
        example: 'Sincere@april.biz',
        description: 'The email of user',
        format: 'email',
        required: true,
    })
    @IsEmail({}, { message: 'email must be a valid email address' })
    @Length(5, 350, {
        message: 'email cannot be less 5 and more than 350 characters',
    })
    @IsString({ message: 'email must be a string' })
    @IsNotEmpty({ message: 'email cannot be an empty' })
    readonly email: string;

    @ApiProperty({
        example: '3f4Ij40)LW_2!iw',
        writeOnly: true,
        required: true,
        format: 'password',
        description: 'Password',
    })
    @IsString({ message: 'password must be a string' })
    @IsNotEmpty({ message: 'password cannot be an empty' })
    readonly password: string;
}
