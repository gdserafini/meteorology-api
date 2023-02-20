import { Controller, Get } from '@overnightjs/core';
import { Request, Response } from 'express';

@Controller('forecast')
export class ForcastController {
  @Get('')
  public getForecastForLoggedUser(_: Request, res: Response): void {
    res.send([
      {
        forecast: 'forecast1',
      },
      {
        forecast: 'forecast2',
      },
    ]);
  }
}
