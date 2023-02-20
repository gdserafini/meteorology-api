import { Server } from '@overnightjs/core';
import bodyParser from 'body-parser';
import { Application } from 'express';
import { ForcastController } from './code/controller/forcast.controller';
import './util/module-alias';

export class SetupServer extends Server {
  constructor(private port = 3000) {
    super();
  }

  private setupExpress(): void {
    this.app.use(bodyParser.json());
    this.setupControllers();
  }

  public init(): void {
    this.setupExpress();
  }

  private setupControllers(): void {
    const forecastController = new ForcastController();
    this.addControllers([forecastController]);
  }

  public getApp(): Application {
    return this.app;
  }
}
