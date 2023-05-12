import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
    TypeOrmModuleAsyncOptions,
    TypeOrmOptionsFactory,
} from '@nestjs/typeorm';
import { SnakeNamingStrategy } from './strategies/snake-naming.strategy';
import { Environment } from '../constants/environment.enum';

@Injectable()
export class DatabaseOptionsService implements TypeOrmOptionsFactory {
    @Inject(ConfigService)
    private readonly config!: ConfigService;

    async createTypeOrmOptions(): Promise<TypeOrmModuleAsyncOptions> {
        return {
            type: this.config.get<string>('DB_TYPE'),
            host: this.config.get<string>('DB_HOST'),
            port: this.config.get<number>('DB_PORT'),
            username: this.config.get<string>('DB_USER'),
            password: this.config.get<string>('DB_PASSWORD'),
            database: this.config.get<string>('DB_NAME'),
            entities: [`${__dirname}/../../**/*.entity{.ts,.js}`],
            namingStrategy: new SnakeNamingStrategy(),
            autoLoadEntities:
                this.config.get<string>('NODE_ENV') === Environment.DEVELOPMENT,
            synchronize:
                this.config.get<string>('NODE_ENV') === Environment.DEVELOPMENT,
            logging: false,
            extra: { charset: 'utf8mb4_unicode_ci' },
        } as TypeOrmModuleAsyncOptions;
    }
}
