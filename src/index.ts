import './util/module-alias';
import config from 'config';
import { SetupServer } from '@src/server';
import logger from './util/logger';

enum ExitStatus {
  SUCCESS = 1,
  FAIL = 0,
}

process.on('unhandledRejection', (reason, promise) => {
  logger.error('App exited: ' + promise + ' - ' + reason);
  throw reason;
});

process.on('uncaughtException', (error) => {
  logger.error(error);
  process.exit(ExitStatus.FAIL);
});

(async (): Promise<void> => {
  try {
    const server = new SetupServer(config.get('App.port'));
    await server.init();
    server.start();
    const exitSignal: NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
    exitSignal.map((sig) =>
      process.on(sig, async () => {
        try {
          await server.close();
          logger.info('App exited with success.');
          process.exit(ExitStatus.SUCCESS);
        } catch (error) {
          logger.error(error);
          process.exit(ExitStatus.FAIL);
        }
      })
    );
  } catch (error) {
    logger.error(error);
    process.exit(ExitStatus.FAIL);
  }
})();
