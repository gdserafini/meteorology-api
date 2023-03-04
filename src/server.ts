import './util/module-alias';
import { Server } from '@overnightjs/core';
import bodyParser from 'body-parser';
import { Application } from 'express';
import * as db from '@src/util/database';
import { ApiController } from '@src/api.controller';
import logger from '@src/util/logger';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { OpenApiValidator } from 'express-openapi-validator';
import { OpenAPIV3 } from 'express-openapi-validator/dist/framework/types';
import apiSchema from '@src/util/api.schema.json';
import { apiErrorValidator } from '@src/code/middleware/api-error-validator';

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

  private setupErrorHandlers(): void {
    this.app.use(apiErrorValidator);
  }

  public async init(): Promise<void> {
    this.setupExpress();
    await this.docSetup();
    this.setupControllers();
    await this.dbSetup();
    this.setupErrorHandlers();
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

  private async docSetup(): Promise<void> {
    this.app.use('/v1/docs', swaggerUi.serve, swaggerUi.setup(apiSchema));
    await new OpenApiValidator({
      apiSpec: apiSchema as OpenAPIV3.Document,
      validateRequests: false,
      validateResponses: false,
    }).install(this.app);
  }
}
