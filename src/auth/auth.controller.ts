import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiConflictResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from '@/models/users/dto/create-user.dto';
import { IUserAuth } from './interfaces/user-auth.interface';
import { SignInDto } from './sign-in.dto';

@ApiTags('Auth')
@Controller('/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @ApiOperation({ summary: 'Sign up a user' })
    @ApiBadRequestResponse({ description: 'Invalid data' })
    @ApiConflictResponse({ description: 'User with that email already exist' })
    @HttpCode(HttpStatus.CREATED)
    @Post('/sign-up')
    async signUp(@Body() data: CreateUserDto): Promise<IUserAuth> {
        return this.authService.signUp(data);
    }

    @ApiOperation({ summary: 'Sign in a user' })
    @ApiUnauthorizedResponse({ description: 'Invalid email or password' })
    @HttpCode(HttpStatus.OK)
    @Post('/sign-in')
    async signIn(@Body() data: SignInDto): Promise<IUserAuth> {
        return this.authService.signIn(data);
    }
}
