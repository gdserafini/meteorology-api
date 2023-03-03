import './util/module-alias';
import { Server } from '@overnightjs/core';
import bodyParser from 'body-parser';
import { Application } from 'express';
import * as db from '@src/util/database';
import { ApiController } from '@src/api.controller';
import logger from '@src/util/logger';
import cors from 'cors';

export class SetupServer extends Server {
  constructor(private port = 3000) {
    super();
  }

  private setupExpress(): void {
    this.app.use(bodyParser.json());
    this.app.use(
      cors({
        origin: '*',
      })
    );
  }

  public async init(): Promise<void> {
    this.setupExpress();
    this.setupControllers();
    await this.dbSetup();
  }

  private setupControllers(): void {
    this.addControllers([new ApiController()]);
  }

  public getApp(): Application {
    return this.app;
  }

  private async dbSetup(): Promise<void> {
    await db.connect();
  }

  public async close(): Promise<void> {
    await db.close();
  }

  public start(): void {
    this.app.listen(this.port, () => {
      logger.info('Server running on port: ' + this.port);
    });
  }
}
