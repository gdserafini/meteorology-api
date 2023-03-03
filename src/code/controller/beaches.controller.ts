import { ClassMiddleware, Controller, Post } from '@overnightjs/core';
import { Request, Response } from 'express';
import { Beach } from '@src/code/model/beach';
import { authMiddleware } from '../middleware/auth';
import { BaseController } from '@src/code/controller/index';
import mongoose from 'mongoose';

@Controller('beaches')
@ClassMiddleware(authMiddleware)
export class BeachesController extends BaseController {
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
      this.sendCreatedUpdateErrorResponse(
        res,
        error instanceof Error
          ? (error as Error)
          : (error as mongoose.Error.ValidationError)
      );
    }
  }
}
