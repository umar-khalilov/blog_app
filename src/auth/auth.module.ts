import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { UserModule } from '@/models/users/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HashModule } from '@/hash/hash.module';

@Module({
    imports: [
        JwtModule.registerAsync({
            global: true,
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (
                config: ConfigService,
            ): Promise<JwtModuleOptions> => ({
                secret: config.get<string>('JWT_ACCESS_TOKEN_SECRET'),
                signOptions: {
                    expiresIn: config.get<string>(
                        'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
                    ),
                    algorithm: 'HS384',
                },
            }),
        }),
        HashModule,
        UserModule,
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService],
})
export class AuthModule {}
