import { Server } from '@overnightjs/core';
import bodyParser from 'body-parser';
import { Application } from 'express';
import { ForcastController } from './code/controller/forcast.controller';
import './util/module-alias';
import * as db from '@src/util/database';

export class SetupServer extends Server {
  constructor(private port = 3000) {
    super();
  }

  private setupExpress(): void {
    this.app.use(bodyParser.json());
    this.setupControllers();
  }

  public async init(): Promise<void> {
    this.setupExpress();
    await this.dbSetup();
  }

  private setupControllers(): void {
    const forecastController = new ForcastController();
    this.addControllers([forecastController]);
  }

  public getApp(): Application {
    return this.app;
  }

  private async dbSetup(): Promise<void>{
    await db.connect();
  }

  public async close(): Promise<void>{
    await db.close();
  }
}
