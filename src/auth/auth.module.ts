import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { HashModule } from '@/hash/hash.module';
import { UserModule } from '@/models/users/user.module';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

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
    providers: [AuthService, AuthResolver],
    exports: [AuthService],
})
export class AuthModule {}
