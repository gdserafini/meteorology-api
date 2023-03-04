import {
  ClassMiddleware,
  Controller,
  Get,
  Middleware,
} from '@overnightjs/core';
import { Request, Response } from 'express';
import { Forecast } from '@src/code/service/forecast';
import { Beach } from '../model/beach';
import { authMiddleware } from '../middleware/auth';
import { BaseController } from '@src/code/controller/index';
import { rateLimit } from 'express-rate-limit';
import ApiError from '@src/util/errors/api-error';

const forecast = new Forecast();
const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  keyGenerator(req: Request): string {
    return req.ip;
  },
  handler(_, res: Response): void {
    res.status(429).send(
      ApiError.format({
        code: 429,
        message: 'Too many requests to the /v1/forescast endpoint',
      })
    );
  },
});

@Controller('forecast')
@ClassMiddleware(authMiddleware)
export class ForcastController extends BaseController {
  @Get('')
  @Middleware(rateLimiter)
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
