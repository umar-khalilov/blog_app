import { App } from './App';

const main = async (): Promise<void> => {
    const app = await App.build();
    await app.listen();
};

void main();
// AppClusterService.runInCluster(main);
