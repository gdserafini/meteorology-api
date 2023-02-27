import { Controller, Post } from '@overnightjs/core';
import { Response, Request } from 'express';
import { User } from '@src/code/model/user';
import { BaseController } from '.';
import mongoose from 'mongoose';

@Controller('users')
export class UserController extends BaseController {
  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const user = new User(req.body);
      const newUser = await user.save();
      res.status(201).send(newUser);
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
