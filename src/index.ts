import './util/module-alias';
import config from 'config';
import { SetupServer } from '@src/server';

(async (): Promise<void> => {
  const server = new SetupServer(config.get('App.port'));
  await server.init();
  server.start();
})();
