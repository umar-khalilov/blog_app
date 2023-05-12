import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
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
