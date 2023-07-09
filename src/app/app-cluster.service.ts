import { availableParallelism } from 'node:os';
import cluster, { Worker } from 'node:cluster';
import { Logger } from '@nestjs/common';

export class AppClusterService {
    private static readonly numberOfCores: number = availableParallelism();
    private static readonly logger = new Logger(AppClusterService.name);

    static runInCluster(callback: () => Promise<void>): void {
        if (cluster.isPrimary) {
            AppClusterService.logger.log(
                `Primary server started on: ${process.pid}`,
            );
            for (let i = 0; i < AppClusterService.numberOfCores; i++) {
                cluster.fork();
            }
            cluster.on(
                'exit',
                (worker: Worker, code: number, signal: string) => {
                    AppClusterService.logger.warn(
                        `Worker: ${worker.process.pid} died with code: ${code} and signal: ${signal}. Restarting`,
                    );
                    cluster.fork();
                },
            );
        } else {
            AppClusterService.logger.log(
                `Cluster server started on: ${process.pid}`,
            );
            void callback();
        }
    }
}
