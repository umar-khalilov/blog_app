import { App } from './App';
import { AppClusterizeService } from './app/app-clusterize.service';

const main = async (): Promise<void> => {
    const app = await App.build();
    await app.listen();
};

void main();
// AppClusterizeService.runInCluster(main);
