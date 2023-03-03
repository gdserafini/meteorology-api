import { ClassMiddleware, Controller, Get } from '@overnightjs/core';
import { Request, Response } from 'express';
import { Forecast } from '@src/code/service/forecast';
import { Beach } from '../model/beach';
import { authMiddleware } from '../middleware/auth';
import { BaseController } from '@src/code/controller/index';

const forecast = new Forecast();

@Controller('forecast')
@ClassMiddleware(authMiddleware)
export class ForcastController extends BaseController {
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
      this.sendErrorResponse(res, {
        code: 500,
        message: 'Something went wrong.',
      });
    }
  }
}
