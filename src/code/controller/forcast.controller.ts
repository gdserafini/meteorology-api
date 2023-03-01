import { ClassMiddleware, Controller, Get } from '@overnightjs/core';
import { Request, Response } from 'express';
import { Forecast } from '@src/code/service/forecast';
import { Beach } from '../model/beach';
import { authMiddleware } from '../middleware/auth';
import logger from '@src/util/logger';

const forecast = new Forecast();

@Controller('forecast')
@ClassMiddleware(authMiddleware)
export class ForcastController {
  @Get('')
  public async getForecastForLoggedUser(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      res
        .status(200)
        .send(
          await forecast.processForecastForBeaches(
            await Beach.find({ user: req.decoded?.id })
          )
        );
    } catch (error) {
      logger.error(error);
      res.status(500).send({ error: 'Something went wrong' });
    }
  }
}
