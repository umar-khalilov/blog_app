import { cpus } from 'node:os';
import cluster, { Worker } from 'node:cluster';
import { Logger } from '@nestjs/common';

export class AppClusterizeService {
    private static readonly numberOfCores: number = cpus().length;
    private static readonly logger = new Logger(AppClusterizeService.name);

    static runInCluster(callback: () => Promise<void>): void {
        if (cluster.isPrimary) {
            AppClusterizeService.logger.log(
                `Primary server started on: ${process.pid}`,
            );
            for (let i = 0; i < AppClusterizeService.numberOfCores; i++) {
                cluster.fork();
            }
            cluster.on(
                'exit',
                (worker: Worker, code: number, signal: string) => {
                    AppClusterizeService.logger.warn(
                        `Worker: ${worker.process.pid} died with code: ${code} and signal: ${signal}. Restarting`,
                    );
                    cluster.fork();
                },
            );
        } else {
            AppClusterizeService.logger.log(
                `Cluster server started on: ${process.pid}`,
            );
            void callback();
        }
    }
}
