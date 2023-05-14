import {
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    Max,
    Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Environment } from './constants/environment.enum';

export class EnvironmentVariables {
    @IsEnum(Environment, { message: 'NODE_ENV must be an enum value' })
    @IsNotEmpty({ message: 'NODE_ENV cannot be an empty value' })
    readonly NODE_ENV: Environment;

    @IsString({ message: 'SERVER_URL must be a string value' })
    @IsOptional({ message: 'SERVER_URL an optional value' })
    readonly SERVER_URL: string;

    @IsString({ message: 'DATABASE_URL must be a string value' })
    @IsOptional({ message: 'DATABASE_URL an optional value' })
    readonly DATABASE_URL: string;

    @Min(0, { message: 'SERVER_PORT cannot be less than zero' })
    @Max(65535, { message: 'SERVER_PORT cannot be more than 65535' })
    @IsInt({ message: 'SERVER_PORT must be an integer value' })
    @Type(() => Number)
    @IsNotEmpty({ message: 'SERVER_PORT cannot be an empty value' })
    readonly SERVER_PORT: number;

    @Min(0, { message: 'DEBUG_PORT cannot be less than zero' })
    @Max(65535, { message: 'DEBUG_PORT cannot be more than 65535' })
    @IsInt({ message: 'DEBUG_PORT must be an integer value' })
    @Type(() => Number)
    @IsNotEmpty({ message: 'DEBUG_PORT cannot be an empty value' })
    readonly DEBUG_PORT: number;

    @IsString({ message: 'DB_TYPE must be a string value' })
    @IsNotEmpty({ message: 'DB_TYPE cannot be an empty value' })
    readonly DB_TYPE: string;

    @IsString({ message: 'DB_HOST must be a string value' })
    @IsNotEmpty({ message: 'DB_HOST cannot be an empty value' })
    readonly DB_HOST: string;

    @Min(0, { message: 'DB_PORT cannot be less than zero' })
    @Max(65535, { message: 'DB_PORT cannot be more than 65535' })
    @IsInt({ message: 'DB_PORT must be an integer value' })
    @Type(() => Number)
    @IsNotEmpty({ message: 'DB_PORT cannot be an empty value' })
    readonly DB_PORT: number;

    @IsString({ message: 'DB_USER must be a string value' })
    @IsNotEmpty({ message: 'DB_USER cannot be an empty value' })
    readonly DB_USER: string;

    @IsString({ message: 'DB_NAME must be a string value' })
    @IsNotEmpty({ message: 'DB_NAME cannot be an empty value' })
    readonly DB_NAME: string;

    @IsString({ message: 'DB_PASSWORD must be a string value' })
    @IsNotEmpty({ message: 'DB_PASSWORD cannot be an empty value' })
    readonly DB_PASSWORD: string;

    @IsInt({ message: 'GRAPHQL_PLAYGROUND must be an integer value' })
    @Type(() => Number)
    @IsNotEmpty({ message: 'GRAPHQL_PLAYGROUND cannot be an empty value' })
    readonly GRAPHQL_PLAYGROUND: number;

    @IsString({ message: 'JWT_ACCESS_TOKEN_SECRET must be a string value' })
    @IsNotEmpty({ message: 'JWT_ACCESS_TOKEN_SECRET cannot be an empty value' })
    readonly JWT_ACCESS_TOKEN_SECRET: string;

    @IsString({
        message: 'JWT_ACCESS_TOKEN_EXPIRATION_TIME must be a string value',
    })
    @IsNotEmpty({
        message: 'JWT_ACCESS_TOKEN_EXPIRATION_TIME cannot be an empty value',
    })
    readonly JWT_ACCESS_TOKEN_EXPIRATION_TIME: string;
}
