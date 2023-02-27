import { Controller, Get } from '@overnightjs/core';
import { Request, Response } from 'express';
import { Forecast } from '@src/code/service/forecast';
import { Beach } from '../model/beach';

const forecast = new Forecast();

@Controller('forecast')
export class ForcastController {
  @Get('')
  public async getForecastForLoggedUser(_: Request, res: Response): Promise<void> {
    try{  
      res.status(200).send(
        await forecast.processForecastForBeaches(
          await Beach.find({})
      ));
    }catch(error){
      res.status(500).send({error: 'Something went wrong'})
    }
  }
}
