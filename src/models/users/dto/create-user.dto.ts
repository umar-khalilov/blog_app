import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsNotEmpty,
    IsString,
    Length,
    Matches,
} from 'class-validator';

export class CreateUserDto {
    @ApiProperty({
        example: 'Leanne Graham',
        description: 'The name of user',
        required: true,
    })
    @Length(3, 450, {
        message: 'name cannot be less 3 and more than 450 characters',
    })
    @IsString({ message: 'name must be a string' })
    @IsNotEmpty({ message: 'name cannot be an empty' })
    readonly name: string;

    @ApiProperty({
        example: 'Bret',
        description: 'The surname of user',
        required: true,
    })
    @Length(3, 450, {
        message: 'surname cannot be less 3 and more than 450 characters',
    })
    @IsString({ message: 'surname must be a string' })
    @IsNotEmpty({ message: 'surname cannot be an empty' })
    readonly surname: string;

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
