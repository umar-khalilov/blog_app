import { NestFactory } from '@nestjs/core';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
    FastifyAdapter,
    NestFastifyApplication,
} from '@nestjs/platform-fastify';
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
        app.useGlobalPipes(
            new ValidationPipe({
                disableErrorMessages: false,
                whitelist: true,
                transform: true,
            }),
        );

        return new App(app);
    }

    async listen(): Promise<void> {
        this.application
            .listen(this.serverPort, '0.0.0.0')
            .then(async () => {
                this.logger.log(
                    `Application documentation is available at ${await this.application.getUrl()}/graphql`,
                );
            })
            .catch(this.logger.log);
    }
}
