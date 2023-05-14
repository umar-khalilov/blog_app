import { join } from 'node:path';
import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UserModule } from '../models/users/user.module';
import { AuthModule } from '../auth/auth.module';
import { DatabaseOptionsService } from './database/database-options.service';
import { SeedingService } from './database/seeds/seeding.service';
import { validateEnv } from './validateEnv';
import { HashModule } from '@/hash/hash.module';
import { BlogModule } from '@/models/blogs/blog.module';
import { PostModule } from '@/models/posts/post.module';

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
                autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
                sortSchema: true,
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
