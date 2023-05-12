import { App } from './App';
import { AppClusterizeService } from './app/app-clusterize.service';

const main = async (): Promise<void> => {
    const app = await App.build();
    await app.listen();
};

// AppClusterizeService.runInCluster(main);
void main();
