import { NestFactory } from '@nestjs/core';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
    FastifyAdapter,
    NestFastifyApplication,
} from '@nestjs/platform-fastify';
import compression from '@fastify/compress';
import { AppModule } from './app/app.module';

export class App {
    private readonly application: INestApplication;
    private readonly config: ConfigService;
    private readonly serverPort: number;
    private readonly logger: Logger;

    constructor(application: INestApplication) {
        this.application = application;
        this.config = this.application.get(ConfigService);
        this.serverPort = this.config.get<number>('SERVER_PORT', 4000);
        this.logger = new Logger(App.name);
        this.buildDocumentation();
    }

    static async build(): Promise<App> {
        const app = await NestFactory.create<NestFastifyApplication>(
            AppModule,
            new FastifyAdapter(),
            {
                cors: true,
                bodyParser: true,
                abortOnError: false,
            },
        );
        app.setGlobalPrefix('api');
        app.useGlobalPipes(
            new ValidationPipe({
                disableErrorMessages: false,
                whitelist: true,
                transform: true,
            }),
        );
        await app.register(compression, {
            encodings: ['gzip', 'deflate'],
        });

        return new App(app);
    }

    private buildDocumentation(): void {
        const swaggerBaseConfigs = new DocumentBuilder()
            .setTitle('Blog API')
            .setDescription('In this blog platform you can manage yours blogs')
            .setVersion('1.0.0')
            .setContact(
                'Umar Khalilov',
                'https://umar-khalilov.github.io',
                'ERMASTER100@gmail.com',
            )
            .addBearerAuth()
            .build();
        const document = SwaggerModule.createDocument(
            this.application,
            swaggerBaseConfigs,
        );
        SwaggerModule.setup('/api/docs', this.application, document);
    }

    async listen(): Promise<void> {
        this.application
            .listen(this.serverPort, '0.0.0.0')
            .then(async () => {
                this.logger.log(
                    `Application documentation is available at ${await this.application.getUrl()}/api/docs`,
                );
            })
            .catch(this.logger.error);
    }
}
