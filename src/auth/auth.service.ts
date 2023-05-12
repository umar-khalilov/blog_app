import {
    BadRequestException,
    ConflictException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@/models/users/user.service';
import { IUserAuth } from './interfaces/user-auth.interface';
import { CreateUserDto } from '@/models/users/dto/create-user.dto';
import { PostgresErrorCode } from '@/app/database/constraints/errors.constraint';
import { IJwtPayload } from './interfaces/jwt-payload.interface';
import { SignInDto } from './sign-in.dto';
import { UserEntity } from '@/models/users/user.entity';
import { UserDto } from '@/models/users/dto/user.dto';
import { HashService } from '@/hash/hash.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly hashService: HashService,
    ) {}

    private async getAccessJWT(payload: IJwtPayload): Promise<string> {
        return this.jwtService.signAsync(payload);
    }

    private async validateUser(data: SignInDto): Promise<UserEntity> {
        const user = await this.userService.findUserByEmail(data.email);

        if (
            user &&
            (await this.hashService.checkIsMatch(data.password, user?.password))
        ) {
            return user;
        } else {
            throw new UnauthorizedException({
                message: 'Invalid email or password',
            });
        }
    }

    async signUp(data: CreateUserDto): Promise<IUserAuth> {
        const hashedPassword = await this.hashService.convertToHashPassword(
            data.password,
        );

        const createdUser = await this.userService
            .createOne({
                ...data,
                password: hashedPassword,
            })
            .catch(error => {
                if (error.code === PostgresErrorCode.UniqueViolation) {
                    throw new ConflictException(
                        `User with that email: ${data.email} already exist'`,
                    );
                }
                throw new BadRequestException('Invalid data');
            });

        const payload: IJwtPayload = {
            sub: createdUser.id,
            email: createdUser.email,
            role: createdUser.role,
        };

        const user = new UserDto(createdUser);
        return {
            tokens: { access: await this.getAccessJWT(payload) },
            user,
        };
    }

    async signIn(data: SignInDto): Promise<IUserAuth> {
        const signedUser = await this.validateUser(data);

        const payload: IJwtPayload = {
            sub: signedUser.id,
            email: signedUser.email,
            role: signedUser.role,
        };

        const user = new UserDto(signedUser);
        return {
            tokens: { access: await this.getAccessJWT(payload) },
            user,
        };
    }
}
