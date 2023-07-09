import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UserModule } from '@/models/users/user.module';
import { AuthModule } from '@/auth/auth.module';
import { DatabaseOptionsService } from './database/database-options.service';
import { SeedingService } from './database/seeds/seeding.service';
import { HashModule } from '@/hash/hash.module';
import { BlogModule } from '@/models/blogs/blog.module';
import { PostModule } from '@/models/posts/post.module';
import { validateEnv } from './validateEnv';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            cache: true,
            envFilePath: '.env',
            validate: validateEnv,
        }),
        TypeOrmModule.forRootAsync({
            useClass: DatabaseOptionsService,
        }),
        GraphQLModule.forRootAsync<ApolloDriverConfig>({
            driver: ApolloDriver,
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                playground: Boolean(configService.get('GRAPHQL_PLAYGROUND')),
                autoSchemaFile: true,
            }),
        }),
        HashModule,
        AuthModule,
        UserModule,
        BlogModule,
        PostModule,
    ],
    controllers: [],
    providers: [SeedingService],
})
export class AppModule implements OnApplicationBootstrap {
    constructor(private readonly seedingService: SeedingService) {}

    async onApplicationBootstrap(): Promise<void> {
        await this.seedingService.seed();
    }
}
