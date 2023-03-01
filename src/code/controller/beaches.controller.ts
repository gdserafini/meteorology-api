import { ClassMiddleware, Controller, Post } from '@overnightjs/core';
import { Request, Response } from 'express';
import { Beach } from '@src/code/model/beach';
import { authMiddleware } from '../middleware/auth';
import logger from '@src/util/logger';
//import  mongoose from "mongoose";

@Controller('beaches')
@ClassMiddleware(authMiddleware)
export class BeachesController {
  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const beach = new Beach({
        ...req.body,
        ...{ user: req.decoded?.id },
      });
      const result = await beach.save();

      res.status(201).send(result);
    } catch (error) {
      logger.error(error);
      res.status(500).send({ error: (error as Error).message });
    }
  }
}
